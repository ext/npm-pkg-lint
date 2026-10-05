import { describe, expect, it } from "@jest/globals";
import { type CliOptions, resolveOptions } from "./resolve-options";

const empty: CliOptions = { allowDependency: [], allowFile: [] };

it("should use defaults when neither cli nor config is set", () => {
	expect.assertions(1);
	expect(resolveOptions(empty)).toEqual({
		allowedDependencies: new Set(),
		allowedFiles: [],
		allowTypesDependencies: undefined,
		ignoreMissingFields: undefined,
		ignoreNodeVersion: false,
	});
});

it("should use config when cli is not set", () => {
	expect.assertions(1);
	const options = resolveOptions(empty, {
		allowDependencies: ["foo"],
		allowFiles: ["a", "b"],
		allowTypesDependencies: true,
		ignoreMissingFields: true,
		ignoreNodeVersion: 18,
		lockfileRegistry: "https://config.example.net/",
	});
	expect(options).toEqual({
		allowedDependencies: new Set(["foo"]),
		allowedFiles: ["a", "b"],
		allowTypesDependencies: true,
		ignoreMissingFields: true,
		ignoreNodeVersion: 18,
		lockfileRegistry: "https://config.example.net/",
	});
});

it("should prefer cli over config", () => {
	expect.assertions(1);
	const options = resolveOptions(
		{
			allowDependency: ["cli"],
			allowFile: ["cli"],
			allowTypesDependencies: true,
			ignoreMissingFields: true,
			ignoreNodeVersion: 20,
			lockfileRegistry: "https://cli.example.net/",
		},
		{
			allowDependencies: ["config"],
			allowFiles: ["config"],
			allowTypesDependencies: false,
			ignoreMissingFields: false,
			ignoreNodeVersion: 18,
			lockfileRegistry: "https://config.example.net/",
		},
	);
	expect(options).toEqual({
		allowedDependencies: new Set(["cli"]),
		allowedFiles: ["cli"],
		allowTypesDependencies: true,
		ignoreMissingFields: true,
		ignoreNodeVersion: 20,
		lockfileRegistry: "https://cli.example.net/",
	});
});

describe("comma-separated lists", () => {
	it("should be split for cli", () => {
		expect.assertions(2);
		const options = resolveOptions({ allowDependency: ["a,b", "c"], allowFile: ["x,y"] });
		expect(options.allowedDependencies).toEqual(new Set(["a", "b", "c"]));
		expect(options.allowedFiles).toEqual(["x", "y"]);
	});

	it("should not be split for config", () => {
		expect.assertions(1);
		const options = resolveOptions(empty, { allowFiles: ["a,b"] });
		expect(options.allowedFiles).toEqual(["a,b"]);
	});
});

it("should let cli ignoreNodeVersion=true override config number", () => {
	expect.assertions(1);
	const options = resolveOptions({ ...empty, ignoreNodeVersion: true }, { ignoreNodeVersion: 18 });
	expect(options.ignoreNodeVersion).toBe(true);
});
