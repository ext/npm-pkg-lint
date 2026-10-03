import { expect, it } from "@jest/globals";
import { validateConfig } from "./validate-config";

const filePath = "/path/to/npm-pkg-lint.config.js";

it("should accept empty config", () => {
	expect.assertions(1);
	expect(validateConfig({}, filePath)).toEqual({});
});

it("should accept all options", () => {
	expect.assertions(1);
	const config = {
		allowDependencies: ["foo"],
		allowFiles: ["bar"],
		allowTypesDependencies: true,
		ignoreMissingFields: false,
		ignoreNodeVersion: 18,
	};
	expect(validateConfig(config, filePath)).toBe(config);
});

it("should accept boolean ignoreNodeVersion", () => {
	expect.assertions(1);
	expect(validateConfig({ ignoreNodeVersion: true }, filePath)).toEqual({
		ignoreNodeVersion: true,
	});
});

it.each([undefined, null, "foo", 12, ["foo"]])("should throw if default export is %p", (value) => {
	expect.assertions(1);
	expect(() => validateConfig(value, filePath)).toThrow(filePath);
});

it("should throw if default export is missing", () => {
	expect.assertions(1);
	expect(() => validateConfig(undefined, filePath)).toThrow("must have a default export");
});

it("should throw on unknown options", () => {
	expect.assertions(1);
	expect(() => validateConfig({ tarball: "foo.tgz", toString: true }, filePath)).toThrow(
		/unknown option "tarball"[\s\S]*unknown option "toString"/,
	);
});

it.each([
	["allowDependencies", "foo"],
	["allowDependencies", [1]],
	["allowFiles", "foo"],
	["allowTypesDependencies", "true"],
	["ignoreMissingFields", 1],
	["ignoreNodeVersion", "18"],
	["ignoreNodeVersion", 1.5],
])("should throw if %s is %p", (key, value) => {
	expect.assertions(1);
	expect(() => validateConfig({ [key]: value }, filePath)).toThrow(`option "${key}" must be`);
});
