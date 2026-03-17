import { Severity } from "@html-validate/stylish";
import { type DocumentNode } from "@humanwhocodes/momoa";
import { type Message } from "../message";
import { type PackageJson, type PackageJsonExports } from "../types";
import { jsonLocation } from "../utils";

const ruleId = "exports-path";
const severity = Severity.ERROR;

function* validatePath(
	pkgAst: DocumentNode,
	value: string | PackageJsonExports | null,
	path: string[],
): Generator<Message> {
	if (value === null) {
		return;
	}

	if (typeof value === "string") {
		if (!value.startsWith("./")) {
			const { line, column } = jsonLocation(pkgAst, "value", "exports", ...path);
			const property = path.map((it) => `["${it}"]`).join("");
			yield {
				ruleId,
				severity,
				message: `"exports${property}" value "${value}" must start with "./"`,
				line,
				column,
			};
		}
		return;
	}

	for (const [key, val] of Object.entries(value)) {
		yield* validatePath(pkgAst, val, [...path, key]);
	}
}

export function* exportsPath(pkg: PackageJson, pkgAst: DocumentNode): Generator<Message> {
	if (pkg.exports) {
		yield* validatePath(pkgAst, pkg.exports, []);
	}
}
