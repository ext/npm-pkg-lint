import { type DocumentNode, parse } from "@humanwhocodes/momoa";
import { PackageJson } from "../types";
import { codeframe } from "../utils/codeframe";
import { exportsImportRequireOrder } from "./exports-import-require-order";

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

it("should report error when import comes after require", () => {
	expect.assertions(1);
	pkg.exports = {
		types: "./index.d.ts",
		require: "./index.cjs",
		import: "./index.mjs",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsImportRequireOrder(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "import" must come before "require" in "exports" (exports-import-require-order) at package.json
		  5 |     "types": "./index.d.ts",
		  6 |     "require": "./index.cjs",
		> 7 |     "import": "./index.mjs"
		    |     ^
		  8 |   }
		  9 | }"
	`);
});

it("should report error when module comes after require", () => {
	expect.assertions(1);
	pkg.exports = {
		types: "./index.d.ts",
		require: "./index.cjs",
		module: "./index.mjs",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsImportRequireOrder(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "module" must come before "require" in "exports" (exports-import-require-order) at package.json
		  5 |     "types": "./index.d.ts",
		  6 |     "require": "./index.cjs",
		> 7 |     "module": "./index.mjs"
		    |     ^
		  8 |   }
		  9 | }"
	`);
});

it("should not report error when import comes before require", () => {
	expect.assertions(1);
	pkg.exports = {
		types: "./index.d.ts",
		import: "./index.mjs",
		require: "./index.cjs",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsImportRequireOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should not report error when module comes before require", () => {
	expect.assertions(1);
	pkg.exports = {
		types: "./index.d.ts",
		module: "./index.mjs",
		require: "./index.cjs",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsImportRequireOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should handle nested objects", () => {
	expect.assertions(1);
	pkg.exports = {
		"./foo": {
			require: "./foo.cjs",
			import: "./foo.mjs",
		},
		"./bar": {
			deeply: {
				nested: {
					require: "./bar.cjs",
					import: "./bar.mjs",
				},
			},
		},
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsImportRequireOrder(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "import" must come before "require" in "exports["./foo"]" (exports-import-require-order) at package.json
		   5 |     "./foo": {
		   6 |       "require": "./foo.cjs",
		>  7 |       "import": "./foo.mjs"
		     |       ^
		   8 |     },
		   9 |     "./bar": {
		  10 |       "deeply": {

		ERROR: "import" must come before "require" in "exports["./bar"]["deeply"]["nested"]" (exports-import-require-order) at package.json
		  11 |         "nested": {
		  12 |           "require": "./bar.cjs",
		> 13 |           "import": "./bar.mjs"
		     |           ^
		  14 |         }
		  15 |       }
		  16 |     }"
	`);
});

it("should report errors for both import and module when both come after require", () => {
	expect.assertions(1);
	pkg.exports = {
		require: "./index.cjs",
		import: "./index.mjs",
		module: "./index.mjs",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsImportRequireOrder(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "import" must come before "require" in "exports" (exports-import-require-order) at package.json
		  4 |   "exports": {
		  5 |     "require": "./index.cjs",
		> 6 |     "import": "./index.mjs",
		    |     ^
		  7 |     "module": "./index.mjs"
		  8 |   }
		  9 | }

		ERROR: "module" must come before "require" in "exports" (exports-import-require-order) at package.json
		  5 |     "require": "./index.cjs",
		  6 |     "import": "./index.mjs",
		> 7 |     "module": "./index.mjs"
		    |     ^
		  8 |   }
		  9 | }"
	`);
});

it("should handle when exports are missing", () => {
	expect.assertions(1);
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsImportRequireOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should handle when exports is string", () => {
	expect.assertions(1);
	pkg.exports = "./index.js";
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsImportRequireOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should handle when exports is empty", () => {
	expect.assertions(1);
	pkg.exports = {};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsImportRequireOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should handle when exports does not include both import and require", () => {
	expect.assertions(1);
	pkg.exports = {
		import: "./index.mjs",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, exportsImportRequireOrder(pkg, ast))).toMatchInlineSnapshot(`""`);
});
