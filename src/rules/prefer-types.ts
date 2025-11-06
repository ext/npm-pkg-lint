import { Severity } from "@html-validate/stylish";
import { type DocumentNode } from "@humanwhocodes/momoa";
import { type Message } from "../message";
import { type PackageJson } from "../types";
import { jsonLocation } from "../utils";

const ruleId = "prefer-types";
const severity = Severity.ERROR;

/**
 * Yields an error if the `typings` field is present instead of `types`.
 *
 * @param pkg - Parsed `package.json"`.
 * @param pkgAst - JSON syntax tree for the `pkg` parameter.
 */
export function* preferTypes(pkg: PackageJson, pkgAst: DocumentNode): Generator<Message> {
	if (!pkg.typings || pkg.types) {
		return;
	}

	const { line, column } = jsonLocation(pkgAst, "member", "typings");
	yield {
		ruleId,
		severity,
		message: `Prefer "types" over "typings"`,
		line,
		column,
	};
}
