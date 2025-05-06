import { Severity } from "@html-validate/stylish";
import { parse, type DocumentNode } from "@humanwhocodes/momoa";
import { PackageJson } from "../types";
import { codeframe } from "../utils/codeframe";
import { outdatedEngines } from "./outdated-engines";

let pkg: PackageJson;

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
		${">= 13.x"}   | ${"Node 13"}
		${">= 14.x"}   | ${"Node 14"}
		${">= 15.x"}   | ${"Node 15"}
		${">= 16.x"}   | ${"Node 16"}
		${">= 17.x"}   | ${"Node 17"}
		${">= 18.x"}   | ${"Node 18"}
		${">= 19.x"}   | ${"Node 19"}
	`("$description", ({ range, description }) => {
		expect.assertions(1);
		pkg.engines = {
			node: range,
		};
		/* eslint-disable-next-line security/detect-non-literal-regexp -- not under user control */
		const message = new RegExp(
			String.raw`engines\.node is satisfied by ${description} \(EOL since \d{4}-.*\)`,
		);
		const { ast } = generateAst(pkg);
		expect(Array.from(outdatedEngines(pkg, ast, false))).toEqual([
			{
				ruleId: "outdated-engines",
				severity: Severity.ERROR,
				message: expect.stringMatching(message),
				line: 5,
				column: 13,
			},
		]);
	});
});

describe("should allow supported version (including odd versions in-between)", () => {
	it.each`
		range        | description
		${">= 20.x"} | ${"Node 20"}
		${">= 21.x"} | ${"Node 21"}
		${">= 22.x"} | ${"Node 22"}
		${">= 23.x"} | ${"Node 23"}
	`("$description", ({ range }) => {
		expect.assertions(1);
		pkg.engines = {
			node: range,
		};
		const { ast } = generateAst(pkg);
		expect(Array.from(outdatedEngines(pkg, ast, false))).toEqual([]);
	});
});

it("should return error engines.node is not a valid semver range", () => {
	expect.assertions(1);
	pkg.engines = {
		node: "foobar",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, outdatedEngines(pkg, ast, false))).toMatchInlineSnapshot(`
		"ERROR: engines.node "foobar" is not a valid semver range (outdated-engines) at package.json
		  3 |   "version": "1.2.3",
		  4 |   "engines": {
		> 5 |     "node": "foobar"
		    |             ^
		  6 |   }
		  7 | }"
	`);
});

it("should return error engines.node is missing", () => {
	expect.assertions(1);
	pkg.engines = {};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, outdatedEngines(pkg, ast, false))).toMatchInlineSnapshot(`
		"ERROR: Missing engines.node field (outdated-engines) at package.json
		  2 |   "name": "mock-package",
		  3 |   "version": "1.2.3",
		> 4 |   "engines": {}
		    |   ^
		  5 | }"
	`);
});

it("should return error engines is missing", () => {
	expect.assertions(1);
	delete pkg.engines;
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, outdatedEngines(pkg, ast, false))).toMatchInlineSnapshot(`
		"ERROR: Missing engines.node field (outdated-engines) at package.json
		> 1 | {
		    | ^
		  2 |   "name": "mock-package",
		  3 |   "version": "1.2.3"
		  4 | }"
	`);
});

it("should not return error when engines.node only supports active versions", () => {
	expect.assertions(1);
	pkg.engines = {
		node: ">= 20",
	};
	const { ast } = generateAst(pkg);
	expect(Array.from(outdatedEngines(pkg, ast, false))).toEqual([]);
});

it("should ignore outdated node version when ignoreNodeVersion is true", () => {
	expect.assertions(1);
	pkg.engines = {
		node: ">= 18",
	};
	const { ast } = generateAst(pkg);
	expect(Array.from(outdatedEngines(pkg, ast, true))).toEqual([]);
});

it("should ignore outdated node version when ignoreNodeVersion is specific major", () => {
	expect.assertions(1);
	pkg.engines = {
		node: ">= 18",
	};
	const { ast } = generateAst(pkg);
	expect(Array.from(outdatedEngines(pkg, ast, 18))).toEqual([]);
});

it("should yield error when ignoreNodeVersion does not match declared engines.node range", () => {
	expect.assertions(1);
	pkg.engines = {
		node: ">= 20",
	};
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, outdatedEngines(pkg, ast, 18))).toMatchInlineSnapshot(`
		"ERROR: --ignore-node-version=18 used but engines.node=">= 20" does not match v18.x or the version is not EOL yet (outdated-engines) at package.json
		  3 |   "version": "1.2.3",
		  4 |   "engines": {
		> 5 |     "node": ">= 20"
		    |             ^
		  6 |   }
		  7 | }"
	`);
});
