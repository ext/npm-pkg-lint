import { parse, type DocumentNode } from "@humanwhocodes/momoa";
import { PackageJson } from "../types";
import { codeframe } from "../utils/codeframe";
import { tsconfigBaseMatchingEngine } from "./tsconfig-base-matching-engine";

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

it("should return error when engine is lower major than @tsconfig/node*", () => {
	expect.assertions(1);
	pkg.devDependencies = {
		"@tsconfig/node14": "^14.1.2",
	};
	pkg.engines.node = ">= 12";
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, tsconfigBaseMatchingEngine(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: @tsconfig/node14 does not match engines.node v12 (tsconfig-base-matching-engine) at package.json
		   6 |   },
		   7 |   "devDependencies": {
		>  8 |     "@tsconfig/node14": "^14.1.2"
		     |     ^
		   9 |   }
		  10 | }"
	`);
});

it("should return error when engine is higher major than @tsconfig/node*", () => {
	expect.assertions(1);
	pkg.devDependencies = {
		"@tsconfig/node14": "^14.1.2",
	};
	pkg.engines.node = ">= 16";
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, tsconfigBaseMatchingEngine(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: @tsconfig/node14 does not match engines.node v16 (tsconfig-base-matching-engine) at package.json
		   6 |   },
		   7 |   "devDependencies": {
		>  8 |     "@tsconfig/node14": "^14.1.2"
		     |     ^
		   9 |   }
		  10 | }"
	`);
});

it("should not return error when engine and types have same major", () => {
	expect.assertions(1);
	pkg.devDependencies = {
		"@tsconfig/node12": "^12.1.2",
	};
	pkg.engines.node = ">= 12";
	const { ast } = generateAst(pkg);
	expect(Array.from(tsconfigBaseMatchingEngine(pkg, ast))).toEqual([]);
});

it("should handle || in engine constraint", () => {
	expect.assertions(1);
	pkg.devDependencies = {
		"@tsconfig/node14": "^14.1.2",
	};
	pkg.engines.node = "^10.2.3 || ^12.2.3 || 14.2.3";
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, tsconfigBaseMatchingEngine(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: @tsconfig/node14 does not match engines.node v10 (tsconfig-base-matching-engine) at package.json
		   6 |   },
		   7 |   "devDependencies": {
		>  8 |     "@tsconfig/node14": "^14.1.2"
		     |     ^
		   9 |   }
		  10 | }"
	`);
});

it("should handle when @tsconfig/node* dependency is missing", () => {
	expect.assertions(1);
	delete pkg.dependencies;
	delete pkg.devDependencies;
	delete pkg.peerDependencies;
	pkg.engines.node = ">= 16";
	const { ast } = generateAst(pkg);
	expect(Array.from(tsconfigBaseMatchingEngine(pkg, ast))).toEqual([]);
});

it("should return error when multiple @tsconfig/node* dependencies are used", () => {
	expect.assertions(1);
	pkg.devDependencies = {
		"@tsconfig/node14": "^14.1.2",
		"@tsconfig/node16": "^16.1.2",
		"@tsconfig/node18": "^16.1.2",
	};
	pkg.engines.node = ">= 16";
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, tsconfigBaseMatchingEngine(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: @tsconfig/node16 and @tsconfig/node14 cannot be used at the same time (tsconfig-base-matching-engine) at package.json
		   7 |   "devDependencies": {
		   8 |     "@tsconfig/node14": "^14.1.2",
		>  9 |     "@tsconfig/node16": "^16.1.2",
		     |     ^
		  10 |     "@tsconfig/node18": "^16.1.2"
		  11 |   }
		  12 | }

		ERROR: @tsconfig/node18 and @tsconfig/node14 cannot be used at the same time (tsconfig-base-matching-engine) at package.json
		   8 |     "@tsconfig/node14": "^14.1.2",
		   9 |     "@tsconfig/node16": "^16.1.2",
		> 10 |     "@tsconfig/node18": "^16.1.2"
		     |     ^
		  11 |   }
		  12 | }"
	`);
});

it("should handle when @tsconfig/other-base dependency is present", () => {
	expect.assertions(1);
	pkg.devDependencies = {
		"@tsconfig/cypress": "^14.1.2",
		"@tsconfig/node-lts": "^14.1.2",
	};
	pkg.engines.node = "^10.2.3 || ^12.2.3 || 14.2.3";
	const { ast } = generateAst(pkg);
	expect(Array.from(tsconfigBaseMatchingEngine(pkg, ast))).toEqual([]);
});

it("should handle when engines.node is missing", () => {
	expect.assertions(1);
	pkg.devDependencies = {
		"@tsconfig/node12": "^12.1.2",
	};
	delete pkg.engines.node;
	const { ast } = generateAst(pkg);
	expect(Array.from(tsconfigBaseMatchingEngine(pkg, ast))).toEqual([]);
});

it("should handle when engines.node is not a valid semver range", () => {
	expect.assertions(1);
	pkg.devDependencies = {
		"@tsconfig/node12": "^12.1.2",
	};
	pkg.engines.node = "foobar";
	const { ast } = generateAst(pkg);
	expect(Array.from(tsconfigBaseMatchingEngine(pkg, ast))).toEqual([]);
});
