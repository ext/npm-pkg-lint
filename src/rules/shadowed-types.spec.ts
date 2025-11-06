/* eslint-disable jest/no-interpolation-in-snapshots -- easier to test both fields this way */

import { type DocumentNode, parse } from "@humanwhocodes/momoa";
import { type PackageJson } from "../types";
import { codeframe } from "../utils/codeframe";
import { shadowedTypes } from "./shadowed-types";

function generateAst(pkg: PackageJson): { content: string; ast: DocumentNode } {
	const content = JSON.stringify(pkg, null, 2);
	return { content, ast: parse(content) };
}

describe.each(["types", "typings"])("%s", (field) => {
	it(`should not allow ${field} field to be shadowed by exports with types condition`, () => {
		expect.assertions(1);
		const pkg: PackageJson = {
			name: "mock-package",
			version: "1.2.3",
			exports: {
				".": {
					types: "./dist/foo.d.ts",
					default: "./dist/foo.js",
				},
			},
			[field]: "./foo.d.ts",
		};
		const { content, ast } = generateAst(pkg);
		expect(codeframe(content, shadowedTypes(pkg, ast))).toMatchInlineSnapshot(`
			"ERROR: "${field}" cannot be resolved when respecting "exports" field (shadowed-types) at package.json
			   8 |     }
			   9 |   },
			> 10 |   "${field}": "./foo.d.ts"
			     |   ^
			  11 | }"
		`);
	});

	it(`should not allow ${field} field to be shadowed by exports without types condition`, () => {
		expect.assertions(1);
		const pkg: PackageJson = {
			name: "mock-package",
			version: "1.2.3",
			exports: {
				".": {
					default: "./dist/foo.js",
				},
			},
			[field]: "./foo.d.ts",
		};
		const { content, ast } = generateAst(pkg);
		expect(codeframe(content, shadowedTypes(pkg, ast))).toMatchInlineSnapshot(`
			"ERROR: "${field}" cannot be resolved when respecting "exports" field (shadowed-types) at package.json
			   7 |     }
			   8 |   },
			>  9 |   "${field}": "./foo.d.ts"
			     |   ^
			  10 | }"
		`);
	});

	it(`should not allow ${field} field to be shadowed by exports subpath string`, () => {
		expect.assertions(1);
		const pkg: PackageJson = {
			name: "mock-package",
			version: "1.2.3",
			exports: {
				".": "./dist/foo.js",
			},
			[field]: "./foo.d.ts",
		};
		const { content, ast } = generateAst(pkg);
		expect(codeframe(content, shadowedTypes(pkg, ast))).toMatchInlineSnapshot(`
			"ERROR: "${field}" cannot be resolved when respecting "exports" field (shadowed-types) at package.json
			  5 |     ".": "./dist/foo.js"
			  6 |   },
			> 7 |   "${field}": "./foo.d.ts"
			    |   ^
			  8 | }"
		`);
	});

	it(`should not allow ${field} field to be shadowed by exports string`, () => {
		expect.assertions(1);
		const pkg: PackageJson = {
			name: "mock-package",
			version: "1.2.3",
			exports: "./dist/foo.js",
			[field]: "./foo.d.ts",
		};
		const { content, ast } = generateAst(pkg);
		expect(codeframe(content, shadowedTypes(pkg, ast))).toMatchInlineSnapshot(`
			"ERROR: "${field}" cannot be resolved when respecting "exports" field (shadowed-types) at package.json
			  3 |   "version": "1.2.3",
			  4 |   "exports": "./dist/foo.js",
			> 5 |   "${field}": "./foo.d.ts"
			    |   ^
			  6 | }"
		`);
	});

	it(`should allow ${field} field when matching exports (with dot slash)`, () => {
		expect.assertions(1);
		const pkg: PackageJson = {
			name: "mock-package",
			version: "1.2.3",
			exports: {
				".": {
					types: "./dist/foo.d.ts",
				},
			},
			[field]: "./dist/foo.d.ts",
		};
		const { content, ast } = generateAst(pkg);
		expect(codeframe(content, shadowedTypes(pkg, ast))).toMatchInlineSnapshot(`""`);
	});

	it(`should allow ${field} field when matching exports (without dot slash)`, () => {
		expect.assertions(1);
		const pkg: PackageJson = {
			name: "mock-package",
			version: "1.2.3",
			exports: {
				".": {
					types: "./dist/foo.d.ts",
				},
			},
			[field]: "dist/foo.d.ts",
		};
		const { content, ast } = generateAst(pkg);
		expect(codeframe(content, shadowedTypes(pkg, ast))).toMatchInlineSnapshot(`""`);
	});

	it(`should handle when exports is missing`, () => {
		expect.assertions(1);
		const pkg: PackageJson = {
			name: "mock-package",
			version: "1.2.3",
			[field]: "dist/foo.d.ts",
		};
		const { content, ast } = generateAst(pkg);
		expect(codeframe(content, shadowedTypes(pkg, ast))).toMatchInlineSnapshot(`""`);
	});

	it(`should handle when ${field} is missing`, () => {
		expect.assertions(1);
		const pkg: PackageJson = {
			name: "mock-package",
			version: "1.2.3",
		};
		const { content, ast } = generateAst(pkg);
		expect(codeframe(content, shadowedTypes(pkg, ast))).toMatchInlineSnapshot(`""`);
	});
});
