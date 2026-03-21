import path from "node:path";
import { verifyPackageLock } from "./package-lock";
import { codeframe } from "./utils/codeframe";

const mockFindUp = jest.fn();
const mockReadFile = jest.fn();

jest.mock("find-up", () => ({
	findUp: (...args: unknown[]) => mockFindUp(...args),
}));

jest.mock("node:fs", () => ({
	promises: {
		readFile: (...args: unknown[]) => mockReadFile(...args),
	},
}));

beforeEach(() => {
	mockFindUp.mockReset().mockResolvedValue(path.join("/mock", "package-lock.json"));
	mockReadFile.mockReset();
});

it("should return error when package-lock.json has lockfileVersion 1", async () => {
	expect.assertions(1);
	const data = { lockfileVersion: 1 };
	const content = JSON.stringify(data, null, 2);
	mockReadFile.mockResolvedValue(content);
	const results = await verifyPackageLock();
	expect(codeframe(content, results)).toMatchInlineSnapshot(`
		"ERROR: package-lock.json has lockfileVersion 1 but expected 3 (package-lock-version) at /mock/package-lock.json
		  1 | {
		> 2 |   "lockfileVersion": 1
		    |                      ^
		  3 | }"
	`);
});

it("should return error when package-lock.json has lockfileVersion 2", async () => {
	expect.assertions(1);
	const data = { lockfileVersion: 2 };
	const content = JSON.stringify(data, null, 2);
	mockReadFile.mockResolvedValue(content);
	const results = await verifyPackageLock();
	expect(codeframe(content, results)).toMatchInlineSnapshot(`
		"ERROR: package-lock.json has lockfileVersion 2 but expected 3 (package-lock-version) at /mock/package-lock.json
		  1 | {
		> 2 |   "lockfileVersion": 2
		    |                      ^
		  3 | }"
	`);
});

it("should return no errors when package-lock.json has lockfileVersion 3", async () => {
	expect.assertions(1);
	const data = { lockfileVersion: 3, packages: {} };
	const content = JSON.stringify(data, null, 2);
	mockReadFile.mockResolvedValue(content);
	const results = await verifyPackageLock();
	expect(codeframe(content, results)).toMatchInlineSnapshot(`""`);
});

it("should return no errors when all packages are resolved from the npm registry", async () => {
	expect.assertions(1);
	const data = {
		lockfileVersion: 3,
		packages: {
			"": {},
			"node_modules/foo": { resolved: "https://registry.npmjs.org/foo/-/foo-1.0.0.tgz" },
			"node_modules/bar": { resolved: "https://registry.npmjs.org/bar/-/bar-2.0.0.tgz" },
		},
	};
	const content = JSON.stringify(data, null, 2);
	mockReadFile.mockResolvedValue(content);
	const results = await verifyPackageLock();
	expect(results).toEqual([]);
});

it("should return error when a package is resolved from a non-npm registry", async () => {
	expect.assertions(1);
	const data = {
		lockfileVersion: 3,
		packages: {
			"": {},
			"node_modules/foo": { resolved: "https://my.private.registry/foo/-/foo-1.0.0.tgz" },
		},
	};
	const content = JSON.stringify(data, null, 2);
	mockReadFile.mockResolvedValue(content);
	const results = await verifyPackageLock();
	expect(codeframe(content, results)).toMatchInlineSnapshot(`
		"ERROR: package "node_modules/foo" is resolved from "https://my.private.registry/foo/-/foo-1.0.0.tgz" instead of the npm registry (package-lock-registry) at /mock/package-lock.json
		  4 |     "": {},
		  5 |     "node_modules/foo": {
		> 6 |       "resolved": "https://my.private.registry/foo/-/foo-1.0.0.tgz"
		    |                   ^
		  7 |     }
		  8 |   }
		  9 | }"
	`);
});

it("should return one error per package resolved from a non-npm registry", async () => {
	expect.assertions(1);
	const data = {
		lockfileVersion: 3,
		packages: {
			"": {},
			"node_modules/foo": { resolved: "https://my.private.registry/foo/-/foo-1.0.0.tgz" },
			"node_modules/bar": { resolved: "https://other.registry/bar/-/bar-2.0.0.tgz" },
		},
	};
	const content = JSON.stringify(data, null, 2);
	mockReadFile.mockResolvedValue(content);
	const results = await verifyPackageLock();
	expect(codeframe(content, results)).toMatchInlineSnapshot(`
		"ERROR: package "node_modules/foo" is resolved from "https://my.private.registry/foo/-/foo-1.0.0.tgz" instead of the npm registry (package-lock-registry) at /mock/package-lock.json
		  4 |     "": {},
		  5 |     "node_modules/foo": {
		> 6 |       "resolved": "https://my.private.registry/foo/-/foo-1.0.0.tgz"
		    |                   ^
		  7 |     },
		  8 |     "node_modules/bar": {
		  9 |       "resolved": "https://other.registry/bar/-/bar-2.0.0.tgz"

		ERROR: package "node_modules/bar" is resolved from "https://other.registry/bar/-/bar-2.0.0.tgz" instead of the npm registry (package-lock-registry) at /mock/package-lock.json
		   7 |     },
		   8 |     "node_modules/bar": {
		>  9 |       "resolved": "https://other.registry/bar/-/bar-2.0.0.tgz"
		     |                   ^
		  10 |     }
		  11 |   }
		  12 | }"
	`);
});

it("should return no errors for packages with link: true", async () => {
	expect.assertions(1);
	const data = {
		lockfileVersion: 3,
		packages: {
			"": {},
			"node_modules/my-lib": { resolved: "packages/my-lib", link: true },
		},
	};
	const content = JSON.stringify(data, null, 2);
	mockReadFile.mockResolvedValue(content);
	const results = await verifyPackageLock();
	expect(results).toEqual([]);
});

it("should return no errors when package-lock.json does not exist", async () => {
	expect.assertions(1);
	const error = Object.assign(new Error("ENOENT"), { code: "ENOENT" });
	mockReadFile.mockRejectedValue(error);
	const results = await verifyPackageLock();
	expect(results).toEqual([]);
});

it("should rethrow error when readFile() rejects with a non-ENOENT error", async () => {
	expect.assertions(1);
	const error = Object.assign(new Error("EACCES"), { code: "EACCES" });
	mockReadFile.mockRejectedValue(error);
	await expect(verifyPackageLock()).rejects.toThrow(error);
});

it("should return no errors when package.json cannot be found on disk", async () => {
	expect.assertions(1);
	mockFindUp.mockResolvedValue(undefined);
	const results = await verifyPackageLock();
	expect(results).toEqual([]);
});
