/* eslint-disable no-console, no-process-exit -- this is a cli tool */
/* eslint-disable camelcase -- argparse likes snake_case */

import { existsSync, createWriteStream, promises as fs } from "fs";
import path from "path";
import { ArgumentParser } from "argparse";
import findUp from "find-up";
import tmp from "tmp";
import stylish from "@html-validate/stylish";
import { setupBlacklist } from "./blacklist";
import { verify, VerifyOptions } from "./verify";
import PackageJson from "./types/package-json";
import { tarballLocation } from "./tarball-location";
import { getFileContent, TarballMeta } from "./tarball";

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const { version } = require("../package.json");

interface ParsedArgs {
	pkgfile: string;
	tarball?: string;
	ignore_missing_fields?: boolean;
	allow_types_dependencies?: boolean;
}

interface GetPackageJsonResults {
	pkg?: PackageJson;
	pkgPath?: string;
}

async function preloadStdin(): Promise<string> {
	return new Promise((resolve, reject) => {
		tmp.file((err, path, fd) => {
			if (err) {
				reject(err);
				return;
			}

			const st = createWriteStream(null, { fd, autoClose: true });
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
	regenerateReportName: boolean
): Promise<GetPackageJsonResults> {
	/* get from explicit path passed as argument */
	if (args.pkgfile) {
		return {
			pkg: JSON.parse(await fs.readFile(args.pkgfile, "utf-8")),
			pkgPath: args.pkgfile,
		};
	}

	/* extract package.json from explicit tarball location */
	if (args.tarball) {
		const contents = await getFileContent({ filePath: args.tarball }, ["package.json"]);
		const pkg = JSON.parse(contents["package.json"].toString("utf-8"));
		return {
			pkg,
			pkgPath: path.join(
				regenerateReportName ? `${pkg.name}-${pkg.version}.tgz` : args.tarball,
				"package.json"
			),
		};
	}

	/* try to locate package.json from file structure */
	const pkgPath = await findUp("package.json");
	if (pkgPath) {
		const relPath = path.relative(process.cwd(), pkgPath);
		return {
			pkg: JSON.parse(await fs.readFile(relPath, "utf-8")),
			pkgPath: relPath,
		};
	}

	return {};
}

async function run(): Promise<void> {
	const parser = new ArgumentParser({
		description: "npm package linter",
	});

	parser.add_argument("-v", "--version", { action: "version", version });
	parser.add_argument("-t", "--tarball", { help: "specify tarball location" });
	parser.add_argument("-p", "--pkgfile", { help: "specify package.json location" });
	parser.add_argument("--allow-types-dependencies", {
		action: "store_true",
		help: "allow dependencies to `@types/*`",
	});
	parser.add_argument("--ignore-missing-fields", {
		action: "store_true",
		help: "ignore errors for missing fields (but still checks for empty and valid)",
	});

	const args: ParsedArgs = parser.parse_args();

	/* this library assumes the file source can be randomly accessed but with
	 * stdin this is not possible so stdin is read into a temporary file which is
	 * used instead */
	let regenerateReportName = false;
	if (args.tarball === "-") {
		args.tarball = await preloadStdin();
		regenerateReportName = true;
	}

	const { pkg, pkgPath } = await getPackageJson(args, regenerateReportName);

	if (!pkg) {
		console.error("Failed to locate package.json and no location was specificed with `--pkgfile'");
		process.exit(1);
	}

	const tarball: TarballMeta = {
		filePath: args.tarball ?? tarballLocation(pkg, pkgPath),
		reportPath: regenerateReportName ? `${pkg.name}-${pkg.version}.tgz` : undefined,
	};
	if (!existsSync(tarball.filePath)) {
		console.error(`"${tarball.filePath}" does not exist, did you forget to run \`npm pack'?`);
		process.exit(1);
	}

	setupBlacklist(pkg.name);

	const options: VerifyOptions = {
		allowTypesDependencies: args.allow_types_dependencies,
		ignoreMissingFields: args.ignore_missing_fields,
	};

	const results = await verify(pkg, pkgPath, tarball, options);
	const output = stylish(results);
	process.stdout.write(output);

	const totalErrors = results.reduce((sum, result) => {
		return sum + result.errorCount;
	}, 0);

	process.exit(totalErrors > 0 ? 1 : 0);
}

run();
