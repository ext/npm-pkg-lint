/* eslint-disable no-console -- this is a cli tool */

import { createWriteStream, existsSync, promises as fs, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { stylish } from "@html-validate/stylish";
import { type DocumentNode, parse } from "@humanwhocodes/momoa";
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

const HELP_TEXT = `usage: index.js [-h] [-v] [-t TARBALL] [-p PKGFILE] [--cache CACHE]
                [--allow-dependency DEPENDENCY] [--allow-types-dependencies]
                [--ignore-missing-fields] [--ignore-node-version [MAJOR]]

Opiniated linter for NPM package tarball and package.json metadata

options:
  -h, --help            show this help message and exit
  -v, --version         show program's version number and exit
  -t, --tarball TARBALL
                        specify tarball location
  -p, --pkgfile PKGFILE
                        specify package.json location
  --cache CACHE         specify cache directory
  --allow-dependency DEPENDENCY
                        explicitly allow given dependency (can be given
                        multiple times or as a comma-separated list)
  --allow-types-dependencies
                        allow production dependencies to \`@types/*\`
  --ignore-missing-fields
                        ignore errors for missing fields (but still checks for
                        empty and valid)
  --ignore-node-version [MAJOR]
                        ignore error for outdated node version (restricted to MAJOR version if given)
`;

interface ParsedArgs {
	cache?: string | undefined;
	pkgfile?: string | undefined;
	tarball?: string | undefined;
	ignoreMissingFields?: boolean | undefined;
	ignoreNodeVersion: boolean | number;
	allowDependency: string[];
	allowTypesDependencies?: boolean | undefined;
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

/**
 * Extract `--ignore-node-version` optional parameter.
 */
function extractIgnoreNodeVersion(argv: readonly string[]): {
	value: boolean | number;
	rest: string[];
} {
	const FLAG = "--ignore-node-version";
	const rest: string[] = [];
	let value: boolean | number = false;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg === FLAG) {
			const next = argv[i + 1];
			if (typeof next === "string" && !next.startsWith("-")) {
				value = parseIgnoreNodeVersionValue(next);
				i++;
			} else {
				value = true;
			}
			continue;
		}

		if (arg.startsWith(`${FLAG}=`)) {
			value = parseIgnoreNodeVersionValue(arg.slice(FLAG.length + 1));
			continue;
		}

		rest.push(arg);
	}

	return { value, rest };
}

function parseIgnoreNodeVersionValue(raw: string): number {
	const parsed = Number(raw);
	if (!Number.isSafeInteger(parsed)) {
		throw new TypeError(`argument --ignore-node-version: invalid int value: '${raw}'`);
	}
	return parsed;
}

type CliResult = { action: "help" } | { action: "version" } | { action: "run"; args: ParsedArgs };

function parseCliArgs(argv: readonly string[]): CliResult {
	const { value: ignoreNodeVersion, rest } = extractIgnoreNodeVersion(argv);
	const { values } = parseArgs({
		args: rest,
		options: {
			help: { type: "boolean", short: "h" },
			version: { type: "boolean", short: "v" },
			tarball: { type: "string", short: "t" },
			pkgfile: { type: "string", short: "p" },
			cache: { type: "string" },
			"allow-dependency": { type: "string", multiple: true, default: [] },
			"allow-types-dependencies": { type: "boolean" },
			"ignore-missing-fields": { type: "boolean" },
		},
		strict: true,
	});

	if (values.help) {
		return { action: "help" };
	}

	if (values.version) {
		return { action: "version" };
	}

	return {
		action: "run",
		args: {
			cache: values.cache,
			pkgfile: values.pkgfile,
			tarball: values.tarball,
			ignoreMissingFields: values["ignore-missing-fields"],
			ignoreNodeVersion,
			allowDependency: values["allow-dependency"],
			allowTypesDependencies: values["allow-types-dependencies"],
		},
	};
}

async function loadPackage(
	args: ParsedArgs,
	regenerateReportName: boolean,
): Promise<
	{ pkg: PackageJson; pkgAst: DocumentNode; pkgPath: string; tarball: TarballMeta } | undefined
> {
	const { pkg, pkgAst, pkgPath } = await getPackageJson(args, regenerateReportName);

	if (!pkg) {
		console.error("Failed to locate package.json and no location was specificed with `--pkgfile'");
		return undefined;
	}

	const tarball: TarballMeta = {
		filePath: args.tarball ?? tarballLocation(pkg, pkgPath),
		reportPath: regenerateReportName ? `${pkg.name}-${pkg.version}.tgz` : undefined,
	};
	if (!existsSync(tarball.filePath)) {
		console.error(`"${tarball.filePath}" does not exist, did you forget to run \`npm pack'?`);
		return undefined;
	}

	return { pkg, pkgAst, pkgPath, tarball };
}

async function run(): Promise<void> {
	let cli: CliResult;
	try {
		cli = parseCliArgs(process.argv.slice(2));
	} catch (err) {
		console.error(err instanceof Error ? err.message : String(err));
		process.exitCode = 1;
		return;
	}

	if (cli.action === "help") {
		console.log(HELP_TEXT);
		return;
	}

	if (cli.action === "version") {
		console.log(version);
		return;
	}

	const { args } = cli;
	const allowedDependencies = new Set(args.allowDependency.flatMap((it) => it.split(",")));

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

	const loaded = await loadPackage(args, regenerateReportName);
	if (!loaded) {
		process.exitCode = 1;
		return;
	}

	const { pkg, pkgAst, pkgPath, tarball } = loaded;

	setupBlacklist(pkg.name);

	const options: VerifyOptions = {
		allowedDependencies,
		allowTypesDependencies: args.allowTypesDependencies,
		ignoreMissingFields: args.ignoreMissingFields,
		ignoreNodeVersion: args.ignoreNodeVersion,
	};

	const results = await verify(pkg, pkgAst, pkgPath, tarball, options);

	for (const result of results) {
		result.messages.sort((a, b) => {
			if (a.line !== b.line) {
				return a.line - b.line;
			}
			return a.column - b.column;
		});
	}

	const output = stylish(results);
	process.stdout.write(output);

	const totalErrors = results.reduce((sum, result) => {
		return sum + result.errorCount;
	}, 0);

	process.exitCode = totalErrors > 0 ? 1 : 0;
}

await run();
