import { Severity } from "@html-validate/stylish";
import { type DocumentNode } from "@humanwhocodes/momoa";
import { type Message } from "../message";
import { type PackageJson, type PackageJsonExports } from "../types";
import { jsonLocation } from "../utils";

const ruleId = "exports-import-require-order";
const severity = Severity.ERROR;

function* validateOrder(
	pkgAst: DocumentNode,
	value: string | PackageJsonExports | null,
	path: string[],
): Generator<Message> {
	if (!value || typeof value === "string") {
		return;
	}

	const keys = Object.keys(value);

	if (keys.includes("require")) {
		for (const esm of ["import", "module"] as const) {
			if (keys.includes(esm) && keys.indexOf(esm) > keys.indexOf("require")) {
				const { line, column } = jsonLocation(pkgAst, "member", "exports", ...path, esm);
				const property = path.map((it) => `["${it}"]`).join("");
				yield {
					ruleId,
					severity,
					message: `"${esm}" must come before "require" in "exports${property}"`,
					line,
					column,
				};
			}
		}
	}

	for (const key of keys) {
		yield* validateOrder(pkgAst, value[key], [...path, key]);
	}
}

export function* exportsImportRequireOrder(
	pkg: PackageJson,
	pkgAst: DocumentNode,
): Generator<Message> {
	if (pkg.exports) {
		yield* validateOrder(pkgAst, pkg.exports, []);
	}
}
