import { Severity } from "@html-validate/stylish";
import { type DocumentNode } from "@humanwhocodes/momoa";
import { type Message } from "../message";
import { type PackageJson } from "../types";
import { jsonLocation } from "../utils";

const ruleId = "conflicting-types-typings";
const severity = Severity.ERROR;

/**
 * Yields an error if both the `types` and `typings` field are set.
 *
 * @param pkg - Parsed `package.json"`.
 * @param pkgAst - JSON syntax tree for the `pkg` parameter.
 */
export function* conflictingTypesTypings(
	pkg: PackageJson,
	pkgAst: DocumentNode,
): Generator<Message> {
	if (!pkg.types || !pkg.typings) {
		return;
	}

	const { line, column } = jsonLocation(pkgAst, "member", "typings");
	yield {
		ruleId,
		severity,
		message: `Duplicate "typings" and "types" field`,
		line,
		column,
	};
}
