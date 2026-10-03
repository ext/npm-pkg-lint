import path from "node:path";
import { beforeEach, expect, it, jest } from "@jest/globals";
import { findConfigFile } from "./find-config";
import { importConfig } from "./import-config";
import { loadConfig } from "./load-config";

jest.mock("./find-config");
jest.mock("./import-config");

const findConfigFileMock = jest.mocked(findConfigFile);
const importConfigMock = jest.mocked(importConfig);

beforeEach(() => {
	jest.resetAllMocks();
});

it("should return undefined when no config is found", async () => {
	expect.assertions(2);
	findConfigFileMock.mockReturnValue(undefined);
	expect(await loadConfig({ cwd: "/cwd" })).toBeUndefined();
	expect(findConfigFileMock).toHaveBeenCalledWith("/cwd");
});

it("should load discovered config", async () => {
	expect.assertions(2);
	findConfigFileMock.mockReturnValue("/cwd/npm-pkg-lint.config.js");
	importConfigMock.mockResolvedValue({ allowFiles: ["foo"] });
	expect(await loadConfig({ cwd: "/cwd" })).toEqual({
		filePath: "/cwd/npm-pkg-lint.config.js",
		config: { allowFiles: ["foo"] },
	});
	expect(importConfigMock).toHaveBeenCalledWith("/cwd/npm-pkg-lint.config.js");
});

it("should resolve explicit config relative to cwd and skip discovery", async () => {
	expect.assertions(3);
	importConfigMock.mockResolvedValue({});
	const result = await loadConfig({ cwd: "/cwd", configFile: "custom/my.config.mjs" });
	expect(result?.filePath).toBe(path.resolve("/cwd", "custom/my.config.mjs"));
	expect(importConfigMock).toHaveBeenCalledWith(path.resolve("/cwd", "custom/my.config.mjs"));
	expect(findConfigFileMock).not.toHaveBeenCalled();
});

it("should wrap import errors", async () => {
	expect.assertions(1);
	importConfigMock.mockRejectedValue(new Error("Cannot find module"));
	await expect(loadConfig({ cwd: "/cwd", configFile: "missing.js" })).rejects.toThrow(
		/Failed to load configuration file ".*missing\.js": Cannot find module/,
	);
});

it("should validate config", async () => {
	expect.assertions(1);
	findConfigFileMock.mockReturnValue("/cwd/npm-pkg-lint.config.js");
	importConfigMock.mockResolvedValue({ unknown: true });
	await expect(loadConfig({ cwd: "/cwd" })).rejects.toThrow('unknown option "unknown"');
});
