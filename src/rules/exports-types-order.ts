import { Severity } from "@html-validate/stylish";
import { type DocumentNode } from "@humanwhocodes/momoa";
import { type Message } from "../message";
import { type PackageJson, type PackageJsonExports } from "../types";
import { jsonLocation } from "../utils";

const ruleId = "exports-types-order";
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
	if (keys.length === 0) {
		return;
	}

	if (keys.includes("types") && keys[0] !== "types") {
		const { line, column } = jsonLocation(pkgAst, "member", "exports", ...path, "types");
		const property = path.map((it) => `["${it}"]`).join("");
		yield {
			ruleId,
			severity,
			message: `"types" must be the first condition in "exports${property}"`,
			line,
			column,
		};
	}

	for (const key of keys) {
		yield* validateOrder(pkgAst, value[key], [...path, key]);
	}
}

export function* exportsTypesOrder(pkg: PackageJson, pkgAst: DocumentNode): Generator<Message> {
	if (pkg.exports) {
		yield* validateOrder(pkgAst, pkg.exports, []);
	}
}
