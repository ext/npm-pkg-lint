import { PackageJson } from "../types";
import { typesNodeMatchingEngine } from "./types-node-matching-engine";

let pkg: PackageJson & Required<Pick<PackageJson, "engines">>;

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
	expect(Array.from(typesNodeMatchingEngine(pkg))).toMatchInlineSnapshot(`
		[
		  {
		    "column": 1,
		    "line": 1,
		    "message": "@types/node v14 does not equal engines.node v12",
		    "ruleId": "types-node-matching-engine",
		    "severity": 2,
		  },
		]
	`);
});

it("should return error when engine is higher major than types", () => {
	expect.assertions(1);
	pkg.devDependencies = {
		"@types/node": "^12.1.2",
	};
	pkg.engines.node = ">= 14";
	expect(Array.from(typesNodeMatchingEngine(pkg))).toMatchInlineSnapshot(`
		[
		  {
		    "column": 1,
		    "line": 1,
		    "message": "@types/node v12 does not equal engines.node v14",
		    "ruleId": "types-node-matching-engine",
		    "severity": 2,
		  },
		]
	`);
});

it("should not return error when engine and types have same major", () => {
	expect.assertions(1);
	pkg.devDependencies = {
		"@types/node": "^12.1.2",
	};
	pkg.engines.node = ">= 12";
	expect(Array.from(typesNodeMatchingEngine(pkg))).toEqual([]);
});

it("should handle || in engine constraint", () => {
	expect.assertions(1);
	pkg.devDependencies = {
		"@types/node": "^14.1.2",
	};
	pkg.engines.node = "^10.2.3 || ^12.2.3 || 14.2.3";
	expect(Array.from(typesNodeMatchingEngine(pkg))).toMatchInlineSnapshot(`
		[
		  {
		    "column": 1,
		    "line": 1,
		    "message": "@types/node v14 does not equal engines.node v10",
		    "ruleId": "types-node-matching-engine",
		    "severity": 2,
		  },
		]
	`);
});

it("should handle when @types/node dependency is missing", () => {
	expect.assertions(1);
	delete pkg.dependencies;
	delete pkg.devDependencies;
	delete pkg.peerDependencies;
	expect(Array.from(typesNodeMatchingEngine(pkg))).toEqual([]);
});

it("should handle when engines.node is missing", () => {
	expect.assertions(1);
	delete pkg.engines.node;
	expect(Array.from(typesNodeMatchingEngine(pkg))).toEqual([]);
});

it("should handle when engines.node is not a valid semver range", () => {
	expect.assertions(1);
	pkg.engines.node = "foobar";
	expect(Array.from(typesNodeMatchingEngine(pkg))).toEqual([]);
});
