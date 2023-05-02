import PackageJson from "../types/package-json";
import { exportsTypesOrder } from "./exports-types-order";

let pkg: PackageJson;

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
	expect(Array.from(exportsTypesOrder(pkg))).toMatchInlineSnapshot(`
		[
		  {
		    "column": 1,
		    "line": 1,
		    "message": ""types" must be the first condition in "exports"",
		    "ruleId": "exports-types-order",
		    "severity": 2,
		  },
		]
	`);
});

it("should not report error when types is first", () => {
	expect.assertions(1);
	pkg.exports = {
		types: "./index.d.ts",
		require: "./index.cjs",
		import: "./index.mjs",
	};
	expect(Array.from(exportsTypesOrder(pkg))).toMatchInlineSnapshot(`[]`);
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
	expect(Array.from(exportsTypesOrder(pkg))).toMatchInlineSnapshot(`
		[
		  {
		    "column": 1,
		    "line": 1,
		    "message": ""types" must be the first condition in "exports["./foo"]"",
		    "ruleId": "exports-types-order",
		    "severity": 2,
		  },
		  {
		    "column": 1,
		    "line": 1,
		    "message": ""types" must be the first condition in "exports["./bar"]["deeply"]["nested"]"",
		    "ruleId": "exports-types-order",
		    "severity": 2,
		  },
		]
	`);
});

it("should handle when exports are missing", () => {
	expect.assertions(1);
	expect(Array.from(exportsTypesOrder(pkg))).toMatchInlineSnapshot(`[]`);
});

it("should handle when exports is string", () => {
	expect.assertions(1);
	pkg.exports = "./index.js";
	expect(Array.from(exportsTypesOrder(pkg))).toMatchInlineSnapshot(`[]`);
});

it("should handle when exports is empty", () => {
	expect.assertions(1);
	pkg.exports = {};
	expect(Array.from(exportsTypesOrder(pkg))).toMatchInlineSnapshot(`[]`);
});

it("should handle when exports does not include types", () => {
	expect.assertions(1);
	pkg.exports = {
		require: "./index.cjs",
		import: "./index.mjs",
	};
	expect(Array.from(exportsTypesOrder(pkg))).toMatchInlineSnapshot(`[]`);
});
