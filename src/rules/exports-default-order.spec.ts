import { type DocumentNode, parse } from "@humanwhocodes/momoa";
import { PackageJson } from "../types";
import { codeframe } from "../utils/codeframe";
import { exportsDefaultOrder } from "./exports-default-order";

let pkg: PackageJson;

function generateAst(pkg: PackageJson): { content: string; ast: DocumentNode } {
	const content = JSON.stringify(pkg, null, 2);
	return { content, ast: parse(content) };
}

beforeEach(() => {
	pkg = {
		name: "mock-package",
		version: "1.2.3",
	};
});

it("should report error when default isn't last", () => {
	expect.assertions(1);
	pkg.exports = {
		default: "./index.js",
		require: "./index.cjs",
		import: "./index.mjs",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsDefaultOrder(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "default" must be the last condition in "exports" (exports-default-order) at package.json
		  3 |   "version": "1.2.3",
		  4 |   "exports": {
		> 5 |     "default": "./index.js",
		    |     ^
		  6 |     "require": "./index.cjs",
		  7 |     "import": "./index.mjs"
		  8 |   }"
	`);
});

it("should not report error when default is last", () => {
	expect.assertions(1);
	pkg.exports = {
		require: "./index.cjs",
		import: "./index.mjs",
		default: "./index.js",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsDefaultOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should handle nested objects", () => {
	expect.assertions(1);
	pkg.exports = {
		"./foo": {
			default: "./foo.js",
			require: "./foo.cjs",
			import: "./foo.mjs",
		},
		"./bar": {
			deeply: {
				nested: {
					default: "./bar.js",
					require: "./bar.cjs",
					import: "./bar.mjs",
				},
			},
		},
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsDefaultOrder(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "default" must be the last condition in "exports["./foo"]" (exports-default-order) at package.json
		  4 |   "exports": {
		  5 |     "./foo": {
		> 6 |       "default": "./foo.js",
		    |       ^
		  7 |       "require": "./foo.cjs",
		  8 |       "import": "./foo.mjs"
		  9 |     },

		ERROR: "default" must be the last condition in "exports["./bar"]["deeply"]["nested"]" (exports-default-order) at package.json
		  11 |       "deeply": {
		  12 |         "nested": {
		> 13 |           "default": "./bar.js",
		     |           ^
		  14 |           "require": "./bar.cjs",
		  15 |           "import": "./bar.mjs"
		  16 |         }"
	`);
});

it("should handle when exports are missing", () => {
	expect.assertions(1);
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsDefaultOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should handle when exports is string", () => {
	expect.assertions(1);
	pkg.exports = "./index.js";
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsDefaultOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should handle when exports is empty", () => {
	expect.assertions(1);
	pkg.exports = {};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsDefaultOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should handle when exports does not include default", () => {
	expect.assertions(1);
	pkg.exports = {
		require: "./index.cjs",
		import: "./index.mjs",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsDefaultOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});
