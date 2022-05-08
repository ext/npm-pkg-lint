/* eslint-disable @typescript-eslint/no-var-requires */

jest.mock("tar");

import { verifyTarball } from "./tarball";
import PackageJson from "./types/package-json";

beforeEach(() => {
	require("tar").__setMockFiles([]);
});

it("should return error if disallowed file is found", async () => {
	expect.assertions(3);
	require("tar").__setMockFiles(["foo.spec.js"]);
	const pkg: PackageJson = {
		name: "mock-pkg",
		version: "1.2.3",
	};
	const results = await verifyTarball(pkg, { filePath: "mock-pkg-1.2.3.tgz" });
	expect(results).toHaveLength(1);
	expect(results[0].filePath).toBe("mock-pkg-1.2.3.tgz");
	expect(results[0].messages).toMatchInlineSnapshot(`
		[
		  {
		    "column": 1,
		    "line": 1,
		    "message": "foo.spec.js is not allowed in tarball",
		    "ruleId": "no-disallowed-files",
		    "severity": 2,
		  },
		]
	`);
});

it("should use reportPath if given", async () => {
	expect.assertions(2);
	require("tar").__setMockFiles(["foo.spec.js"]);
	const pkg: PackageJson = {
		name: "mock-pkg",
		version: "1.2.3",
	};
	const results = await verifyTarball(pkg, {
		filePath: "mock-pkg-1.2.3.tgz",
		reportPath: "other-path",
	});
	expect(results).toHaveLength(1);
	expect(results[0].filePath).toBe("other-path");
});

describe("should return error if package.json references missing file", () => {
	it.each`
		field               | template
		${"main"}           | ${{ main: "index.js" }}
		${"browser"}        | ${{ browser: "index.js" }}
		${"module"}         | ${{ module: "index.js" }}
		${"jsnext:main"}    | ${{ "jsnext:main": "index.js" }}
		${"typings"}        | ${{ typings: "index.d.ts" }}
		${"bin (single)"}   | ${{ bin: "index.js" }}
		${"bin (multiple)"} | ${{ bin: { foo: "dist/foo.js", bar: "dist/bar.js" } }}
		${"man (single)"}   | ${{ man: "man/foo.1" }}
		${"man (multiple)"} | ${{ man: ["man/foo.1", "man/bar.1"] }}
	`("$field", async ({ template }) => {
		expect.assertions(3);
		require("tar").__setMockFiles([]);
		const pkg: PackageJson = {
			name: "mock-pkg",
			version: "1.2.3",
			...template,
		};
		const results = await verifyTarball(pkg, { filePath: "mock-pkg-1.2.3.tgz" });
		expect(results).toHaveLength(1);
		expect(results[0].filePath).toBe("mock-pkg-1.2.3.tgz");
		expect(results[0].messages).toMatchSnapshot();
	});
});

describe("should not return error if package.json references existing file", () => {
	it.each`
		field               | template
		${"main"}           | ${{ main: "index.js" }}
		${"browser"}        | ${{ browser: "index.js" }}
		${"module"}         | ${{ module: "index.js" }}
		${"jsnext:main"}    | ${{ "jsnext:main": "index.js" }}
		${"typings"}        | ${{ typings: "index.d.ts" }}
		${"bin (single)"}   | ${{ bin: "index.js" }}
		${"bin (multiple)"} | ${{ bin: { foo: "dist/foo.js", bar: "dist/bar.js" } }}
		${"man (single)"}   | ${{ man: "man/foo.1" }}
		${"man (multiple)"} | ${{ man: ["man/foo.1", "man/bar.1"] }}
	`("$field", async ({ template }) => {
		expect.assertions(1);
		require("tar").__setMockFiles([
			"index.js",
			"index.d.ts",
			"dist/foo.js",
			"dist/bar.js",
			"man/foo.1",
			"man/bar.1",
		]);
		const pkg: PackageJson = {
			name: "mock-pkg",
			version: "1.2.3",
			...template,
		};
		const results = await verifyTarball(pkg, { filePath: "mock-path" });
		expect(results).toEqual([]);
	});
});

it("should handle directories with index.js", async () => {
	expect.assertions(1);
	require("tar").__setMockFiles(["dist/index.js"]);
	const pkg: PackageJson = {
		name: "mock-pkg",
		version: "1.2.3",
		main: "dist",
	};
	const results = await verifyTarball(pkg, { filePath: "mock-path" });
	expect(results).toEqual([]);
});

it("should handle directories with index.js and trailing slash", async () => {
	expect.assertions(1);
	require("tar").__setMockFiles(["dist/index.js"]);
	const pkg: PackageJson = {
		name: "mock-pkg",
		version: "1.2.3",
		main: "dist/",
	};
	const results = await verifyTarball(pkg, { filePath: "mock-path" });
	expect(results).toEqual([]);
});

it("should handle filenames without .js", async () => {
	expect.assertions(1);
	require("tar").__setMockFiles(["index.js"]);
	const pkg: PackageJson = {
		name: "mock-pkg",
		version: "1.2.3",
		main: "index",
	};
	const results = await verifyTarball(pkg, { filePath: "mock-path" });
	expect(results).toEqual([]);
});

it("should handle leading ./", async () => {
	expect.assertions(1);
	require("tar").__setMockFiles(["index.js"]);
	const pkg: PackageJson = {
		name: "mock-pkg",
		version: "1.2.3",
		main: "./index.js",
	};
	const results = await verifyTarball(pkg, { filePath: "mock-path" });
	expect(results).toEqual([]);
});

it("should handle browser field containing false", async () => {
	expect.assertions(1);
	require("tar").__setMockFiles(["index.js"]);
	const pkg: PackageJson = {
		name: "mock-pkg",
		version: "1.2.3",
		browser: {
			foo: false,
		},
	};
	const results = await verifyTarball(pkg, { filePath: "mock-path" });
	expect(results).toEqual([]);
});
