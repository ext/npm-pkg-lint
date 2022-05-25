import { Severity } from "@html-validate/stylish";
import PackageJson from "../types/package-json";
import { outdatedEngines } from "./outdated-engines";

let pkg: PackageJson;

beforeEach(() => {
	pkg = {
		name: "mock-package",
		version: "1.2.3",
		engines: {},
	};
});

describe("should return error when unsupported version satisfies engines.node", () => {
	it.each`
		range          | description
		${">= 0.10.x"} | ${"Node 0.10"}
		${">= 0.12.x"} | ${"Node 0.12"}
		${">= 4.x"}    | ${"Node 4"}
		${">= 5.x"}    | ${"Node 5"}
		${">= 6.x"}    | ${"Node 6"}
		${">= 7.x"}    | ${"Node 7"}
		${">= 8.x"}    | ${"Node 8"}
		${">= 9.x"}    | ${"Node 9"}
		${">= 10.x"}   | ${"Node 10"}
		${">= 11.x"}   | ${"Node 11"}
		${">= 12.x"}   | ${"Node 12"}
	`("$description", ({ range, description }) => {
		expect.assertions(1);
		pkg.engines.node = range;
		/* eslint-disable-next-line security/detect-non-literal-regexp */
		const message = new RegExp(
			String.raw`engines\.node is satisfied by ${description} \(EOL since \d{4}-.*\)`
		);
		expect(Array.from(outdatedEngines(pkg))).toEqual([
			{
				ruleId: "outdated-engines",
				severity: Severity.ERROR,
				message: expect.stringMatching(message),
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
		[
		  {
		    "column": 1,
		    "line": 1,
		    "message": "engines.node "foobar" is not a valid semver range",
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
		[
		  {
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
		[
		  {
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
	pkg.engines.node = ">= 14";
	expect(Array.from(outdatedEngines(pkg))).toMatchInlineSnapshot(`[]`);
});
