import { type DocumentNode, parse } from "@humanwhocodes/momoa";
import { type PackageJson } from "../types";
import { codeframe } from "../utils/codeframe";
import { preferTypes } from "./prefer-types";

function generateAst(pkg: PackageJson): { content: string; ast: DocumentNode } {
	const content = JSON.stringify(pkg, null, 2);
	return { content, ast: parse(content) };
}

it(`should report error when "typings" is used instead of "types"`, () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "mock-package",
		version: "1.2.3",
		typings: "./foo.d.ts",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, preferTypes(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: Prefer "types" over "typings" (prefer-types) at package.json
		  2 |   "name": "mock-package",
		  3 |   "version": "1.2.3",
		> 4 |   "typings": "./foo.d.ts"
		    |   ^
		  5 | }"
	`);
});

it(`should not report error when both "typings" and "types" are set`, () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "mock-package",
		version: "1.2.3",
		types: "./foo.d.ts",
		typings: "./foo.d.ts",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, preferTypes(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it(`should not report when only "types" is set`, () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "mock-package",
		version: "1.2.3",
		types: "./foo.d.ts",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, preferTypes(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it(`should not report when neither "types" or "typings" is set`, () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "mock-package",
		version: "1.2.3",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, preferTypes(pkg, ast))).toMatchInlineSnapshot(`""`);
});
