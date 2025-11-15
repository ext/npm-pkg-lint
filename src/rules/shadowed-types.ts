import { Severity } from "@html-validate/stylish";
import { type DocumentNode } from "@humanwhocodes/momoa";
import { type Message } from "../message";
import { type PackageJson, type PackageJsonExports } from "../types";
import { jsonLocation } from "../utils";

const ruleId = "shadowed-types";
const severity = Severity.ERROR;

function walkConditions(conditions: PackageJsonExports | string | null): string[] {
	if (!conditions || typeof conditions === "string") {
		return [];
	}

	const types = conditions.types;
	if (typeof types === "string") {
		return [types];
	}

	return Object.values(conditions).reduce<string[]>((subpaths, it) => {
		return [...subpaths, ...walkConditions(it)];
	}, []);
}

/**
 * Given the value of the "exports" field get all "types" conditions.
 *
 * @internal
 */
export function getTypesConditions(exports: PackageJsonExports | string | null): string[] {
	if (exports === null || typeof exports === "string") {
		return [];
	}

	const dot = exports["."];
	if (dot) {
		return walkConditions(dot);
	}

	const types = exports.types;
	if (types && typeof types === "string") {
		return [types];
	}

	return [];
}

/**
 * Compare "types" from "exports" with the "types" or "typings" field and yields
 * an error if there is a mismatch.
 *
 * @param pkgAst - JSON syntax tree to get error location from.
 * @param subpaths - The resolved value from exports ".".
 * @param field - Which field holds the value parameter.
 * @param value - The value of the "types" or "typings" field.
 */
function* validateTypeSubpath(
	pkgAst: DocumentNode,
	subpaths: string[],
	field: "types" | "typings",
	value: string,
): Generator<Message> {
	/* normalize types/typings value to always start with ./ as required by the exports field */
	const normalizedValue = value.startsWith("./") ? value : `./${value}`;

	/* test if the types value matches one or more subpath export */
	if (subpaths.some((it) => it === normalizedValue)) {
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

	const subpaths = getTypesConditions(exports);

	if (pkg.types) {
		yield* validateTypeSubpath(pkgAst, subpaths, "types", pkg.types);
	}

	if (pkg.typings) {
		yield* validateTypeSubpath(pkgAst, subpaths, "typings", pkg.typings);
	}
}
