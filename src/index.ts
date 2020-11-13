/* eslint-disable no-console, no-process-exit -- this is a cli tool */

import { existsSync, promises as fs } from "fs";
import path from "path";
import { ArgumentParser } from "argparse";
import findUp from "find-up";
import { setupBlacklist } from "./blacklist";
import { verifyTarball } from "./tarball";
import PackageJson from "./types/package-json";

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const stylish = require("eslint/lib/cli-engine/formatters/stylish");

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

function defaultTarballLocation(pkg: PackageJson, pkgPath: string): string {
	return path.join(path.dirname(pkgPath), `${pkg.name}-${pkg.version}.tgz`);
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
	const tarball = args.tarball ?? defaultTarballLocation(pkg, pkgPath);

	if (!existsSync(tarball)) {
		console.error(`"${tarball}" does not exist, did you forget to run \`npm pack'?`);
		process.exit(1);
	}

	setupBlacklist(pkg.name);

	const results = [await verifyTarball(tarball)];
	const output = stylish(results);
	process.stdout.write(output);

	const totalErrors = results.reduce((sum, result) => {
		return sum + result.errorCount;
	}, 0);

	process.exit(totalErrors > 0 ? 1 : 0);
}

run();
