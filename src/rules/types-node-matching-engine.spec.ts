import { type DocumentNode, parse } from "@humanwhocodes/momoa";
import { PackageJson } from "../types";
import { codeframe } from "../utils/codeframe";
import { typesNodeMatchingEngine } from "./types-node-matching-engine";

let pkg: PackageJson & Required<Pick<PackageJson, "engines">>;

function generateAst(pkg: PackageJson): { content: string; ast: DocumentNode } {
	const content = JSON.stringify(pkg, null, 2);
	return { content, ast: parse(content) };
}

beforeEach(() => {
	pkg = {
		name: "mock-package",
		version: "1.2.3",
		engines: {},
	};
});

it("should return error when engine is lower major than types", () => {
	expect.assertions(1);
	pkg.devDependencies = {
		"@types/node": "^14.1.2",
	};
	pkg.engines.node = ">= 12";
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, typesNodeMatchingEngine(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: @types/node v14 does not equal engines.node v12 (types-node-matching-engine) at package.json
		   6 |   },
		   7 |   "devDependencies": {
		>  8 |     "@types/node": "^14.1.2"
		     |                    ^
		   9 |   }
		  10 | }"
	`);
});

it("should return error when engine is higher major than types", () => {
	expect.assertions(1);
	pkg.devDependencies = {
		"@types/node": "^12.1.2",
	};
	pkg.engines.node = ">= 14";
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, typesNodeMatchingEngine(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: @types/node v12 does not equal engines.node v14 (types-node-matching-engine) at package.json
		   6 |   },
		   7 |   "devDependencies": {
		>  8 |     "@types/node": "^12.1.2"
		     |                    ^
		   9 |   }
		  10 | }"
	`);
});

it("should not return error when engine and types have same major", () => {
	expect.assertions(1);
	pkg.devDependencies = {
		"@types/node": "^12.1.2",
	};
	pkg.engines.node = ">= 12";
	const { ast } = generateAst(pkg);
	expect(Array.from(typesNodeMatchingEngine(pkg, ast))).toEqual([]);
});

it("should handle || in engine constraint", () => {
	expect.assertions(1);
	pkg.devDependencies = {
		"@types/node": "^14.1.2",
	};
	pkg.engines.node = "^10.2.3 || ^12.2.3 || 14.2.3";
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, typesNodeMatchingEngine(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: @types/node v14 does not equal engines.node v10 (types-node-matching-engine) at package.json
		   6 |   },
		   7 |   "devDependencies": {
		>  8 |     "@types/node": "^14.1.2"
		     |                    ^
		   9 |   }
		  10 | }"
	`);
});

it("should handle when @types/node dependency is missing", () => {
	expect.assertions(1);
	delete pkg.dependencies;
	delete pkg.devDependencies;
	delete pkg.peerDependencies;
	const { ast } = generateAst(pkg);
	expect(Array.from(typesNodeMatchingEngine(pkg, ast))).toEqual([]);
});

it("should handle when engines.node is missing", () => {
	expect.assertions(1);
	delete pkg.engines.node;
	const { ast } = generateAst(pkg);
	expect(Array.from(typesNodeMatchingEngine(pkg, ast))).toEqual([]);
});

it("should handle when engines.node is not a valid semver range", () => {
	expect.assertions(1);
	pkg.engines.node = "foobar";
	const { ast } = generateAst(pkg);
	expect(Array.from(typesNodeMatchingEngine(pkg, ast))).toEqual([]);
});
