import { type DocumentNode, parse } from "@humanwhocodes/momoa";
import { type PackageJson } from "../types";
import { codeframe } from "../utils/codeframe";
import { conflictingTypesTypings } from "./conflicting-types-typings";

function generateAst(pkg: PackageJson): { content: string; ast: DocumentNode } {
	const content = JSON.stringify(pkg, null, 2);
	return { content, ast: parse(content) };
}

it(`should report error when both "types" and "typings" is used`, () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "mock-package",
		version: "1.2.3",
		types: "./foo.d.ts",
		typings: "./foo.d.ts",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, conflictingTypesTypings(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: Duplicate "typings" and "types" field (conflicting-types-typings) at package.json
		  3 |   "version": "1.2.3",
		  4 |   "types": "./foo.d.ts",
		> 5 |   "typings": "./foo.d.ts"
		    |   ^
		  6 | }"
	`);
});

it(`should not report when only "types" is set`, () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "mock-package",
		version: "1.2.3",
		types: "index.d.ts",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, conflictingTypesTypings(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it(`should not report when only "typings" is set`, () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "mock-package",
		version: "1.2.3",
		typings: "index.d.ts",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, conflictingTypesTypings(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it(`should not report when neither "types" or "typings" is set`, () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "mock-package",
		version: "1.2.3",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, conflictingTypesTypings(pkg, ast))).toMatchInlineSnapshot(`""`);
});
