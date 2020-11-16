import fs from "fs";
import tar, { FileStat, Parse } from "tar";
import PackageJson from "./types/package-json";
import { isBlacklisted } from "./blacklist";
import { Message } from "./message";
import { Result } from "./result";

interface RequiredFile {
	field: string;
	ruleId: string;
	filename: string;
}

function normalize(filename: string): string {
	return filename.replace(/^package\//, "");
}

export async function getFileList(filename: string): Promise<string[]> {
	const entries: FileStat[] = [];
	await tar.list({
		file: filename,
		strict: true,
		onentry: (entry: FileStat) => entries.push(entry),
	});
	return entries.map((entry) => {
		const filename = (entry.path as unknown) as string;
		return normalize(filename);
	});
}

export async function getFileContent(
	tarball: string,
	filenames: string[]
): Promise<Record<string, Buffer>> {
	const contents: Record<string, Buffer> = {};

	return new Promise((resolve, reject) => {
		/* eslint-disable-next-line @typescript-eslint/ban-ts-comment -- The @types/tar go this one completely wrong */
		/* @ts-ignore */
		const t = new Parse({
			filter(_path: string, entry: tar.ReadEntry): boolean {
				return filenames.includes(normalize(entry.path));
			},
		});
		t.on("entry", (entry: tar.ReadEntry) => {
			contents[normalize(entry.path)] = Buffer.alloc(0);
			entry.on("data", (data: Buffer) => {
				contents[normalize(entry.path)] = Buffer.concat([contents[normalize(entry.path)], data]);
			});
			entry.on("error", (error) => {
				reject(error);
			});
		});
		t.on("end", () => {
			resolve(contents);
		});
		const rs = fs.createReadStream(tarball);
		rs.pipe(t);
	});
}

export async function blacklistedFiles(filelist: string[]): Promise<string[]> {
	return filelist.filter(isBlacklisted);
}

function normalizeRequiredFiles(src: string | string[] | Record<string, string>): string[] {
	if (typeof src === "string") {
		return [src];
	} else if (Array.isArray(src)) {
		return src;
	} else {
		return Object.values(src);
	}
}

function* yieldRequiredFiles(
	src: string | string[] | Record<string, string>,
	template: Pick<RequiredFile, "field" | "ruleId">
): Generator<RequiredFile> {
	const files = normalizeRequiredFiles(src);
	for (const filename of files) {
		yield { ...template, filename };
	}
}

function* requiredFiles(pkg: PackageJson): Generator<RequiredFile> {
	if (pkg.main) {
		yield* yieldRequiredFiles(pkg.main, { field: "main", ruleId: "no-missing-main" });
	}
	if (pkg.browser) {
		yield* yieldRequiredFiles(pkg.browser, { field: "browser", ruleId: "no-missing-main" });
	}
	if (pkg.module) {
		yield* yieldRequiredFiles(pkg.module, { field: "module", ruleId: "no-missing-main" });
	}
	if (pkg["jsnext:main"]) {
		yield* yieldRequiredFiles(pkg["jsnext:main"], {
			field: "jsnext:main",
			ruleId: "no-missing-main",
		});
	}
	if (pkg.typings) {
		yield* yieldRequiredFiles(pkg.typings, { field: "typings", ruleId: "no-missing-typings" });
	}
	if (pkg.bin) {
		yield* yieldRequiredFiles(pkg.bin, { field: "bin", ruleId: "no-missing-binary" });
	}
	if (pkg.man) {
		yield* yieldRequiredFiles(pkg.man, { field: "man", ruleId: "no-missing-man" });
	}
}

function fileExists(filelist: string[], filename: string): boolean {
	/* strip leading ./ */
	filename = filename.replace(/^\.\//, "");

	/* exact match for filename */
	if (filelist.includes(filename)) {
		return true;
	}

	/* test if it is actually a directory with index.js */
	if (filelist.includes(`${filename}/index.js`)) {
		return true;
	}

	return false;
}

export async function verifyTarball(pkg: PackageJson, filePath: string): Promise<Result[]> {
	const messages: Message[] = [];
	const filelist = await getFileList(filePath);

	for (const filename of await blacklistedFiles(filelist)) {
		messages.push({
			ruleId: "no-disallowed-files",
			severity: 2,
			message: `${filename} is not allowed in tarball`,
			line: 1,
			column: 1,
		});
	}

	for (const requiredFile of requiredFiles(pkg)) {
		if (!fileExists(filelist, requiredFile.filename)) {
			messages.push({
				ruleId: requiredFile.ruleId,
				severity: 2,
				message: `${requiredFile.filename} (pkg.${requiredFile.field}) is not present in tarball`,
				line: 1,
				column: 1,
			});
		}
	}

	if (messages.length === 0) {
		return [];
	}

	return [
		{
			messages,
			filePath,
			errorCount: messages.length,
			warningCount: 0,
			fixableErrorCount: 0,
			fixableWarningCount: 0,
		},
	];
}
