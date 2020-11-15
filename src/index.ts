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

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const { version } = require("../package.json");

interface ParsedArgs {
	pkgfile: string;
	tarball?: string;
}

async function defaultPkgLocation(): Promise<string | undefined> {
	const pkgPath = await findUp("package.json");
	if (pkgPath) {
		return path.relative(process.cwd(), pkgPath);
	} else {
		return undefined;
	}
}

async function run(): Promise<void> {
	const parser = new ArgumentParser({
		description: "npm package linter",
	});

	parser.add_argument("-v", "--version", { action: "version", version });
	parser.add_argument("-t", "--tarball", { help: "specify tarball location" });
	parser.add_argument("-p", "--pkgfile", { help: "specify package.json location" });

	const args: ParsedArgs = parser.parse_args();
	const pkgPath = args.pkgfile ?? (await defaultPkgLocation());

	if (!pkgPath) {
		console.error("Failed to locate package.json and no location was specificed with `--pkgfile'");
		process.exit(1);
	}

	const pkg: PackageJson = JSON.parse(await fs.readFile(pkgPath, "utf-8"));
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
