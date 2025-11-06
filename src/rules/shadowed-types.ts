import { Severity } from "@html-validate/stylish";
import { type DocumentNode } from "@humanwhocodes/momoa";
import { type Message } from "../message";
import { type PackageJson, type PackageJsonExports } from "../types";
import { jsonLocation } from "../utils";

const ruleId = "shadowed-types";
const severity = Severity.ERROR;

function findDotTypes(exports: string | PackageJsonExports): string | null {
	if (typeof exports === "string") {
		return null;
	}
	const dot = exports["."];
	if (!dot || typeof dot === "string") {
		return null;
	}
	const types = dot.types;
	if (typeof types === "string") {
		return types;
	} else {
		return null;
	}
}

/**
 * Compare "types" from "exports" with the "types" or "typings" field and yields
 * an error if there is a mismatch.
 *
 * @param pkgAst - JSON syntax tree to get error location from.
 * @param subpath - The resolved value from exports ".".
 * @param field - Which field holds the value parameter.
 * @param value - The value of the "types" or "typings" field.
 */
function* validateTypeSubpath(
	pkgAst: DocumentNode,
	subpath: string | null,
	field: "types" | "typings",
	value: string,
): Generator<Message> {
	/* `{types: "dist/foo.d.ts"}` - compare directly with subpath (which always contains the `./` prefix) */
	if (value.startsWith("./") && subpath === value) {
		return;
	}

	/* `{types: "dist/foo.d.ts"}` - add `./` prefix before comparison */
	if (subpath === `./${value}`) {
		return;
	}

	const { line, column } = jsonLocation(pkgAst, "member", field);
	yield {
		ruleId,
		severity,
		message: `"${field}" cannot be resolved when respecting "exports" field`,
		line,
		column,
	};
}

/**
 * Validates the `"types"` or `"typings"` field against the `"exports"` field to
 * ensure all versions of TypeScript can resolve the types.
 *
 * @param pkg - Parsed `package.json"`.
 * @param pkgAst - JSON syntax tree for the `pkg` parameter.
 */
export function* shadowedTypes(pkg: PackageJson, pkgAst: DocumentNode): Generator<Message> {
	const { exports } = pkg;
	if (!exports) {
		return;
	}

	const subpath = findDotTypes(exports);

	if (pkg.types) {
		yield* validateTypeSubpath(pkgAst, subpath, "types", pkg.types);
	}

	if (pkg.typings) {
		yield* validateTypeSubpath(pkgAst, subpath, "typings", pkg.typings);
	}
}
