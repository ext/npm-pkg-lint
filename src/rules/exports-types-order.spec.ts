import { parse, type DocumentNode } from "@humanwhocodes/momoa";
import { PackageJson } from "../types";
import { codeframe } from "../utils/codeframe";
import { exportsTypesOrder } from "./exports-types-order";

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

it("should report error when types isn't first", () => {
	expect.assertions(1);
	pkg.exports = {
		require: "./index.cjs",
		import: "./index.mjs",
		types: "./index.d.ts",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsTypesOrder(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "types" must be the first condition in "exports" (exports-types-order) at package.json
		  5 |     "require": "./index.cjs",
		  6 |     "import": "./index.mjs",
		> 7 |     "types": "./index.d.ts"
		    |     ^
		  8 |   }
		  9 | }"
	`);
});

it("should not report error when types is first", () => {
	expect.assertions(1);
	pkg.exports = {
		types: "./index.d.ts",
		require: "./index.cjs",
		import: "./index.mjs",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsTypesOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should handle nested objects", () => {
	expect.assertions(1);
	pkg.exports = {
		"./foo": {
			require: "./foo.cjs",
			import: "./foo.mjs",
			types: "./foo.d.ts",
		},
		"./bar": {
			deeply: {
				nested: {
					require: "./bar.cjs",
					import: "./bar.mjs",
					types: "./bar.d.ts",
				},
			},
		},
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsTypesOrder(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "types" must be the first condition in "exports["./foo"]" (exports-types-order) at package.json
		   6 |       "require": "./foo.cjs",
		   7 |       "import": "./foo.mjs",
		>  8 |       "types": "./foo.d.ts"
		     |       ^
		   9 |     },
		  10 |     "./bar": {
		  11 |       "deeply": {

		ERROR: "types" must be the first condition in "exports["./bar"]["deeply"]["nested"]" (exports-types-order) at package.json
		  13 |           "require": "./bar.cjs",
		  14 |           "import": "./bar.mjs",
		> 15 |           "types": "./bar.d.ts"
		     |           ^
		  16 |         }
		  17 |       }
		  18 |     }"
	`);
});

it("should handle when exports are missing", () => {
	expect.assertions(1);
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsTypesOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should handle when exports is string", () => {
	expect.assertions(1);
	pkg.exports = "./index.js";
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsTypesOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should handle when exports is empty", () => {
	expect.assertions(1);
	pkg.exports = {};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsTypesOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should handle when exports does not include types", () => {
	expect.assertions(1);
	pkg.exports = {
		require: "./index.cjs",
		import: "./index.mjs",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsTypesOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});
