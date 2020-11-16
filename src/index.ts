/* eslint-disable no-console, no-process-exit -- this is a cli tool */

import { existsSync, promises as fs } from "fs";
import path from "path";
import { ArgumentParser } from "argparse";
import findUp from "find-up";
import stylish from "@html-validate/stylish";
import { setupBlacklist } from "./blacklist";
import { verify } from "./verify";
import PackageJson from "./types/package-json";
import { tarballLocation } from "./tarball-location";
import { getFileContent } from "./tarball";

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const { version } = require("../package.json");

interface ParsedArgs {
	pkgfile: string;
	tarball?: string;
}

interface GetPackageJsonResults {
	pkg?: PackageJson;
	pkgPath?: string;
}

async function getPackageJson(args: ParsedArgs): Promise<GetPackageJsonResults> {
	/* get from explicit path passed as argument */
	if (args.pkgfile) {
		return {
			pkg: JSON.parse(await fs.readFile(args.pkgfile, "utf-8")),
			pkgPath: args.pkgfile,
		};
	}

	/* extract package.json from explicit tarball location */
	if (args.tarball) {
		const contents = await getFileContent(args.tarball, ["package.json"]);
		return {
			pkg: JSON.parse(contents["package.json"].toString("utf-8")),
			pkgPath: path.join(args.tarball, "package.json"),
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

	const args: ParsedArgs = parser.parse_args();
	const { pkg, pkgPath } = await getPackageJson(args);

	if (!pkg) {
		console.error("Failed to locate package.json and no location was specificed with `--pkgfile'");
		process.exit(1);
	}

	const tarball = args.tarball ?? tarballLocation(pkg, pkgPath);
	if (!existsSync(tarball)) {
		console.error(`"${tarball}" does not exist, did you forget to run \`npm pack'?`);
		process.exit(1);
	}

	setupBlacklist(pkg.name);

	const results = await verify(pkg, pkgPath, tarball);
	const output = stylish(results);
	process.stdout.write(output);

	const totalErrors = results.reduce((sum, result) => {
		return sum + result.errorCount;
	}, 0);

	process.exit(totalErrors > 0 ? 1 : 0);
}

run();
