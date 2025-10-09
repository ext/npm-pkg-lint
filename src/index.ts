/* eslint-disable no-console -- this is a cli tool */

import { createWriteStream, existsSync, promises as fs, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stylish } from "@html-validate/stylish";
import { type DocumentNode, parse } from "@humanwhocodes/momoa";
import { ArgumentParser } from "argparse";
import { findUp } from "find-up";
import tmp from "tmp";
import { setupBlacklist } from "./blacklist";
import { type TarballMeta, getFileContent } from "./tarball";
import { tarballLocation } from "./tarball-location";
import { type PackageJson } from "./types";
import { setCacheDirecory } from "./utils/persistent-cache";
import { type VerifyOptions, verify } from "./verify";

const pkgFilepath = fileURLToPath(new URL("../package.json", import.meta.url));
const { version } = JSON.parse(readFileSync(pkgFilepath, "utf-8")) as { version: string };

const PACKAGE_JSON = "package.json";

interface ParsedArgs {
	cache?: string;
	pkgfile: string;
	tarball?: string;
	ignore_missing_fields?: boolean;
	ignore_node_version: boolean | number;
	allow_dependency: string[];
	allow_types_dependencies?: boolean;
}

interface GetPackageJsonResults {
	pkg: PackageJson;
	pkgAst: DocumentNode;
	pkgPath: string;
}

async function preloadStdin(): Promise<string> {
	return new Promise((resolve, reject) => {
		tmp.file((err, path, fd) => {
			if (err) {
				reject(err);
				return;
			}

			const st = createWriteStream("", { fd, autoClose: true });
			process.stdin.pipe(st);
			st.on("finish", () => {
				resolve(path);
			});
			st.on("error", (err) => {
				reject(err);
			});
		});
	});
}

async function getPackageJson(
	args: ParsedArgs,
	regenerateReportName: boolean,
): Promise<GetPackageJsonResults | { pkg: undefined; pkgAst: undefined; pkgPath: undefined }> {
	/* get from explicit path passed as argument */
	if (args.pkgfile) {
		const content = await fs.readFile(args.pkgfile, "utf-8");
		const pkg = JSON.parse(content) as PackageJson;
		const pkgAst = parse(content);
		return {
			pkg,
			pkgAst,
			pkgPath: args.pkgfile,
		};
	}

	/* extract package.json from explicit tarball location */
	if (args.tarball) {
		const contents = await getFileContent({ filePath: args.tarball }, [PACKAGE_JSON]);
		const content = contents[PACKAGE_JSON].toString("utf-8");
		const pkg = JSON.parse(content) as PackageJson;
		const pkgAst = parse(content);
		return {
			pkg,
			pkgAst,
			pkgPath: path.join(
				regenerateReportName ? `${pkg.name}-${pkg.version}.tgz` : args.tarball,
				PACKAGE_JSON,
			),
		};
	}

	/* try to locate package.json from file structure */
	const pkgPath = await findUp(PACKAGE_JSON);
	if (pkgPath) {
		const content = await fs.readFile(pkgPath, "utf-8");
		const pkg = JSON.parse(content) as PackageJson;
		const pkgAst = parse(content);
		return {
			pkg,
			pkgAst,
			pkgPath,
		};
	}

	return { pkg: undefined, pkgAst: undefined, pkgPath: undefined };
}

async function run(): Promise<void> {
	const parser = new ArgumentParser({
		description: "Opiniated linter for NPM package tarball and package.json metadata",
	});

	parser.add_argument("-v", "--version", { action: "version", version });
	parser.add_argument("-t", "--tarball", { help: "specify tarball location" });
	parser.add_argument("-p", "--pkgfile", { help: "specify package.json location" });
	parser.add_argument("--cache", { help: "specify cache directory" });
	parser.add_argument("--allow-dependency", {
		action: "append",
		default: [],
		metavar: "DEPENDENCY",
		help: "explicitly allow given dependency (can be given multiple times or as a comma-separated list)",
	});
	parser.add_argument("--allow-types-dependencies", {
		action: "store_true",
		help: "allow production dependencies to `@types/*`",
	});
	parser.add_argument("--ignore-missing-fields", {
		action: "store_true",
		help: "ignore errors for missing fields (but still checks for empty and valid)",
	});
	parser.add_argument("--ignore-node-version", {
		nargs: "?",
		metavar: "MAJOR",
		type: "int",
		default: false,
		const: true,
		help: "ignore error for outdated node version (restricted to MAJOR version if given)",
	});

	const args = parser.parse_args() as ParsedArgs;
	const allowedDependencies = new Set(args.allow_dependency.map((it) => it.split(",")).flat());

	if (args.cache) {
		await setCacheDirecory(args.cache);
	}

	/* this library assumes the file source can be randomly accessed but with
	 * stdin this is not possible so stdin is read into a temporary file which is
	 * used instead */
	let regenerateReportName = false;
	if (args.tarball === "-") {
		args.tarball = await preloadStdin();
		regenerateReportName = true;
	}

	const { pkg, pkgAst, pkgPath } = await getPackageJson(args, regenerateReportName);

	if (!pkg) {
		console.error("Failed to locate package.json and no location was specificed with `--pkgfile'");
		process.exitCode = 1;
		return;
	}

	const tarball: TarballMeta = {
		filePath: args.tarball ?? tarballLocation(pkg, pkgPath),
		reportPath: regenerateReportName ? `${pkg.name}-${pkg.version}.tgz` : undefined,
	};
	if (!existsSync(tarball.filePath)) {
		console.error(`"${tarball.filePath}" does not exist, did you forget to run \`npm pack'?`);
		process.exitCode = 1;
		return;
	}

	setupBlacklist(pkg.name);

	const options: VerifyOptions = {
		allowedDependencies,
		allowTypesDependencies: args.allow_types_dependencies,
		ignoreMissingFields: args.ignore_missing_fields,
		ignoreNodeVersion: args.ignore_node_version,
	};

	const results = await verify(pkg, pkgAst, pkgPath, tarball, options);

	for (const result of results) {
		result.messages.sort((a, b) => {
			if (a.line !== b.line) {
				return a.line - b.line;
			} else {
				return a.column - b.column;
			}
		});
	}

	const output = stylish(results);
	process.stdout.write(output);

	const totalErrors = results.reduce((sum, result) => {
		return sum + result.errorCount;
	}, 0);

	process.exitCode = totalErrors > 0 ? 1 : 0;
}

run().catch((err: unknown) => {
	console.error(err);
	process.exitCode = 1;
});
