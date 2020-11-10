import { promises as fs } from "fs";
import { ArgumentParser } from "argparse";
import { setupBlacklist } from "./blacklist";
import { blacklistedFiles } from "./tarball";
import { Message } from "./message";
import { Result } from "./result";

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const stylish = require("eslint/lib/cli-engine/formatters/stylish");

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const { version } = require("../package.json");

async function verifyTarball(filePath: string): Promise<Result> {
	const messages: Message[] = [];

	for (const filename of await blacklistedFiles(filePath)) {
		messages.push({
			ruleId: "no-disallowed-files",
			severity: 2,
			message: `${filename} is not allowed in tarball`,
			line: 1,
			column: 1,
		});
	}

	return {
		messages,
		filePath,
		errorCount: messages.length,
		warningCount: 0,
	};
}

async function run(): Promise<void> {
	const parser = new ArgumentParser({
		description: "npm package linter",
	});

	parser.add_argument("-v", "--version", { action: "version", version });
	parser.add_argument("-t", "--tarball", { help: "TARBALL", required: true });
	parser.add_argument("-p", "--pkgfile", { help: "FILENAME", required: true });

	const args = parser.parse_args();
	const pkg = JSON.parse(await fs.readFile(args.pkgfile, "utf-8"));

	setupBlacklist(pkg.name);

	const results = [await verifyTarball(args.tarball)];
	const output = stylish(results);
	process.stdout.write(output);

	const totalErrors = results.reduce((sum, result) => {
		return sum + result.errorCount;
	}, 0);

	/* eslint-disable-next-line no-process-exit -- this is a cli tool */
	process.exit(totalErrors > 0 ? 1 : 0);
}

run();
