import { Severity } from "@html-validate/stylish/dist/severity";
import PackageJson from "../types/package-json";
import { outdatedEngines } from "./outdated-engines";

let pkg: PackageJson;
const ruleId = "outdated-engines";
const severity = Severity.ERROR;

beforeEach(() => {
	pkg = {
		name: "mock-package",
		version: "1.2.3",
		engines: {},
	};
});

describe("should return error when unsupported version satisfies engines.node", () => {
	it.each`
		range          | description    | date
		${">= 0.10.x"} | ${"Node 0.10"} | ${"2016-10-31"}
		${">= 0.12.x"} | ${"Node 0.12"} | ${"2016-12-31"}
		${">= 4.x"}    | ${"Node 4"}    | ${"2018-04-30"}
		${">= 5.x"}    | ${"Node 5"}    | ${"2016-06-30"}
		${">= 6.x"}    | ${"Node 6"}    | ${"2019-04-30"}
		${">= 7.x"}    | ${"Node 7"}    | ${"2017-06-30"}
		${">= 8.x"}    | ${"Node 8"}    | ${"2019-12-31"}
		${">= 9.x"}    | ${"Node 9"}    | ${"2018-06-30"}
	`("$description", ({ range, description, date }) => {
		expect.assertions(1);
		pkg.engines.node = range;
		expect(Array.from(outdatedEngines(pkg))).toEqual([
			{
				ruleId: "outdated-engines",
				severity: Severity.ERROR,
				message: `engines.node is satisfied by ${description} (EOL since ${date})`,
				line: 1,
				column: 1,
			},
		]);
	});
});

it("should return error engines.node is not a valid semver range", () => {
	expect.assertions(1);
	pkg.engines.node = "foobar";
	expect(Array.from(outdatedEngines(pkg))).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "column": 1,
		    "line": 1,
		    "message": "engines.node \\"foobar\\" is not a valid semver range",
		    "ruleId": "outdated-engines",
		    "severity": 2,
		  },
		]
	`);
});

it("should return error engines.node is missing", () => {
	expect.assertions(1);
	delete pkg.engines.node;
	expect(Array.from(outdatedEngines(pkg))).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "column": 1,
		    "line": 1,
		    "message": "Missing engines.node field",
		    "ruleId": "outdated-engines",
		    "severity": 2,
		  },
		]
	`);
});

it("should return error engines is missing", () => {
	expect.assertions(1);
	delete pkg.engines;
	expect(Array.from(outdatedEngines(pkg))).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "column": 1,
		    "line": 1,
		    "message": "Missing engines.node field",
		    "ruleId": "outdated-engines",
		    "severity": 2,
		  },
		]
	`);
});

it("should not return error when engines.node only supports active versions", () => {
	expect.assertions(1);
	pkg.engines.node = ">= 10";
	expect(Array.from(outdatedEngines(pkg))).toMatchInlineSnapshot(`Array []`);
});
