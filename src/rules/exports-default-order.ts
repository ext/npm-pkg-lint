import { Severity } from "@html-validate/stylish";
import { type DocumentNode } from "@humanwhocodes/momoa";
import { type Message } from "../message";
import { type PackageJson, type PackageJsonExports } from "../types";
import { jsonLocation } from "../utils";

const ruleId = "exports-default-order";
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

	if (keys.includes("default") && keys.at(-1) !== "default") {
		const { line, column } = jsonLocation(pkgAst, "member", "exports", ...path, "default");
		const property = path.map((it) => `["${it}"]`).join("");
		yield {
			ruleId,
			severity,
			message: `"default" must be the last condition in "exports${property}"`,
			line,
			column,
		};
	}

	for (const key of keys) {
		yield* validateOrder(pkgAst, value[key], [...path, key]);
	}
}

export function* exportsDefaultOrder(pkg: PackageJson, pkgAst: DocumentNode): Generator<Message> {
	if (pkg.exports) {
		yield* validateOrder(pkgAst, pkg.exports, []);
	}
}
