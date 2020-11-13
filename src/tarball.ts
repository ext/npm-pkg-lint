import tar, { FileStat } from "tar";
import PackageJson from "./types/package-json";
import { isBlacklisted } from "./blacklist";
import { Message } from "./message";
import { Result } from "./result";

interface RequiredFile {
	field: string;
	ruleId: string;
	filename: string;
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
		return filename.replace(/^package\//, "");
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

export async function verifyTarball(pkg: PackageJson, filePath: string): Promise<Result> {
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
		if (!filelist.includes(requiredFile.filename)) {
			messages.push({
				ruleId: requiredFile.ruleId,
				severity: 2,
				message: `${requiredFile.filename} (pkg.${requiredFile.field}) is not present in tarball`,
				line: 1,
				column: 1,
			});
		}
	}

	return {
		messages,
		filePath,
		errorCount: messages.length,
		warningCount: 0,
	};
}
