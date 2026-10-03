import path from "node:path";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import memfs from "memfs";
import { findConfigFile } from "./find-config";

jest.mock("node:fs", () => {
	return jest.requireActual<typeof memfs>("memfs").fs;
});

const { vol } = memfs;

const cwd = "/project";

beforeEach(() => {
	vol.reset();
});

describe("should find configuration file", () => {
	it.each([
		"npm-pkg-lint.config.js",
		"npm-pkg-lint.config.mjs",
		"npm-pkg-lint.config.ts",
		"npm-pkg-lint.config.mts",
		"config/npm-pkg-lint.config.js",
		".github/npm-pkg-lint.config.js",
		".gitlab/npm-pkg-lint.config.js",
	])("%s", (filename) => {
		expect.assertions(1);
		const filePath = path.join(cwd, filename);
		vol.fromJSON({ [filePath]: "" });
		expect(findConfigFile(cwd)).toBe(filePath);
	});
});

it("should return undefined when no file is found", () => {
	expect.assertions(1);
	expect(findConfigFile(cwd)).toBeUndefined();
});

it("should throw when multiple files are found", () => {
	expect.assertions(1);
	vol.fromJSON(
		{
			"npm-pkg-lint.config.js": "",
			".github/npm-pkg-lint.config.mjs": "",
		},
		cwd,
	);
	expect(() => findConfigFile(cwd)).toThrowErrorMatchingInlineSnapshot(`
		"Multiple configuration files found, remove all but one or select one with \`--config\`:
		  - /project/npm-pkg-lint.config.js
		  - /project/.github/npm-pkg-lint.config.mjs"
	`);
});
