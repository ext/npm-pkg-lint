import { type DocumentNode, parse } from "@humanwhocodes/momoa";
import { PackageJson } from "../types";
import { codeframe } from "../utils/codeframe";
import { exportsPath } from "./exports-path";

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

it("should report error when condition value does not start with ./", () => {
	expect.assertions(1);
	pkg.exports = {
		import: "index.mjs",
		require: "index.cjs",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsPath(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "exports["import"]" value "index.mjs" must start with "./" (exports-path) at package.json
		  3 |   "version": "1.2.3",
		  4 |   "exports": {
		> 5 |     "import": "index.mjs",
		    |               ^
		  6 |     "require": "index.cjs"
		  7 |   }
		  8 | }

		ERROR: "exports["require"]" value "index.cjs" must start with "./" (exports-path) at package.json
		  4 |   "exports": {
		  5 |     "import": "index.mjs",
		> 6 |     "require": "index.cjs"
		    |                ^
		  7 |   }
		  8 | }"
	`);
});

it("should not report error when all values start with ./", () => {
	expect.assertions(1);
	pkg.exports = {
		import: "./index.mjs",
		require: "./index.cjs",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsPath(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should report error when top-level string does not start with ./", () => {
	expect.assertions(1);
	pkg.exports = "index.js";
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsPath(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "exports" value "index.js" must start with "./" (exports-path) at package.json
		  2 |   "name": "mock-package",
		  3 |   "version": "1.2.3",
		> 4 |   "exports": "index.js"
		    |              ^
		  5 | }"
	`);
});

it("should not report error when top-level string starts with ./", () => {
	expect.assertions(1);
	pkg.exports = "./index.js";
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsPath(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should handle nested objects", () => {
	expect.assertions(1);
	pkg.exports = {
		"./foo": {
			import: "foo.mjs",
			require: "./foo.cjs",
		},
		"./bar": {
			deeply: {
				nested: {
					import: "./bar.mjs",
					require: "bar.cjs",
				},
			},
		},
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsPath(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "exports["./foo"]["import"]" value "foo.mjs" must start with "./" (exports-path) at package.json
		  4 |   "exports": {
		  5 |     "./foo": {
		> 6 |       "import": "foo.mjs",
		    |                 ^
		  7 |       "require": "./foo.cjs"
		  8 |     },
		  9 |     "./bar": {

		ERROR: "exports["./bar"]["deeply"]["nested"]["require"]" value "bar.cjs" must start with "./" (exports-path) at package.json
		  11 |         "nested": {
		  12 |           "import": "./bar.mjs",
		> 13 |           "require": "bar.cjs"
		     |                      ^
		  14 |         }
		  15 |       }
		  16 |     }"
	`);
});

it("should handle null values", () => {
	expect.assertions(1);
	pkg.exports = {
		import: "./index.mjs",
		require: null,
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsPath(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should handle when exports are missing", () => {
	expect.assertions(1);
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsPath(pkg, ast))).toMatchInlineSnapshot(`""`);
});
