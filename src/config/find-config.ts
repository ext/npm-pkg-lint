import { existsSync } from "node:fs";
import path from "node:path";

const basename = "npm-pkg-lint.config";
const extensions = [".js", ".mjs", ".ts", ".mts"];
const directories = [".", "config", ".github", ".gitlab"];

function* candidates(root: string): Generator<string> {
	for (const directory of directories) {
		for (const extension of extensions) {
			yield path.join(root, directory, `${basename}${extension}`);
		}
	}
}

/**
 * Find the configuration file in `dir`, `dir/config`, `dir/.github` and
 * `dir/.gitlab`. Parent directories are not searched.
 *
 * @returns Absolute path to the file or `undefined` if no file was found.
 * @throws If more than one candidate was found.
 */
export function findConfigFile(dir: string): string | undefined {
	const found = Array.from(candidates(path.resolve(dir))).filter((it) => existsSync(it));

	if (found.length > 1) {
		const list = found.map((it) => `  - ${it}`).join("\n");
		throw new Error(
			`Multiple configuration files found, remove all but one or select one with \`--config\`:\n${list}`,
		);
	}

	return found[0];
}
