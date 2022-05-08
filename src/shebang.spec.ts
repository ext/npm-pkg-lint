/* eslint-disable security/detect-object-injection */

let mockContents: Record<string, Buffer>;

jest.mock("./tarball", () => {
	return {
		getFileContent(_tarball: string, filenames: string[]): Promise<Record<string, Buffer>> {
			const result = filenames.reduce((st: Record<string, Buffer>, filename: string) => {
				st[filename] = mockContents[filename];
				return st;
			}, {} as Record<string, Buffer>);
			return Promise.resolve(result);
		},
	};
});

import { verifyShebang } from "./shebang";
import PackageJson from "./types/package-json";

beforeEach(() => {
	mockContents = {};
});

it("should not return error if package has no binaries", async () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "mock-pkg",
		version: "1.2.3",
	};
	const results = await verifyShebang(pkg, { filePath: "mock-pkg-1.2.3.tgz" });
	expect(results).toEqual([]);
});

it("should not return error if file has proper shebang", async () => {
	expect.assertions(1);
	mockContents = {
		"index.js": Buffer.from("#!/usr/bin/env node\nmodule.exports = 12\n"),
		"script.sh": Buffer.from("#!/bin/sh\necho 42\n"),
	};
	const pkg: PackageJson = {
		name: "mock-pkg",
		version: "1.2.3",
		bin: {
			"mock-pkg": "index.js",
			script: "script.sh",
		},
	};
	const results = await verifyShebang(pkg, { filePath: "mock-pkg-1.2.3.tgz" });
	expect(results).toEqual([]);
});

it("should return error when binary is missing shebang", async () => {
	expect.assertions(3);
	mockContents = {
		"index.js": Buffer.from("module.exports = 12\n"),
	};
	const pkg: PackageJson = {
		name: "mock-pkg",
		version: "1.2.3",
		bin: "index.js",
	};
	const results = await verifyShebang(pkg, { filePath: "mock-pkg-1.2.3.tgz" });
	expect(results).toHaveLength(1);
	expect(results[0].filePath).toBe("index.js");
	expect(results[0].messages).toMatchInlineSnapshot(`
		[
		  {
		    "column": 1,
		    "line": 1,
		    "message": "first line must contain shebang to be executable",
		    "ruleId": "no-missing-shebang",
		    "severity": 2,
		  },
		]
	`);
});

it("should return error when binary shebang is not first line", async () => {
	expect.assertions(3);
	mockContents = {
		"index.js": Buffer.from("\n#!/usr/bin/env node\n"),
	};
	const pkg: PackageJson = {
		name: "mock-pkg",
		version: "1.2.3",
		bin: "index.js",
	};
	const results = await verifyShebang(pkg, { filePath: "mock-pkg-1.2.3.tgz" });
	expect(results).toHaveLength(1);
	expect(results[0].filePath).toBe("index.js");
	expect(results[0].messages).toMatchInlineSnapshot(`
		[
		  {
		    "column": 1,
		    "line": 1,
		    "message": "first line must contain shebang to be executable",
		    "ruleId": "no-missing-shebang",
		    "severity": 2,
		  },
		]
	`);
});
