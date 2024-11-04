import spawn from "nano-spawn";
import { type ExecaError, type NpmInfoError, npmInfo, isNpmInfoError } from "./npm-info";

jest.mock("nano-spawn");
jest.mock("./persistent-cache");

const mockSpawn = spawn as unknown as jest.Mock;

function createExecaError(message: string, stdout: string | Record<string, unknown>): Error {
	const error = new Error(message) as Error & ExecaError;
	error.stdout = typeof stdout === "string" ? stdout : JSON.stringify(stdout);
	return error;
}

mockSpawn.mockImplementation((_, args: string[]) => {
	const [name, version] = args.at(-1)!.split("@");

	switch (name) {
		case "exception":
			throw new Error("Unrelated exception");

		case "unpublished":
			throw createExecaError("mock error", {
				error: {
					code: "E404",
					summary: "Mock summary",
					detail: "Mock details",
				},
			});

		case "unpublished-garbage":
			throw createExecaError("mock error", "garbage non-json response");

		default:
			return {
				stdout: JSON.stringify({ name, version }),
			};
	}
});

beforeEach(() => {
	jest.clearAllMocks();
});

it("should fetch package info", async () => {
	expect.assertions(2);
	const pkgData = await npmInfo("my-package@1.2.3");
	expect(mockSpawn).toHaveBeenCalledWith("npm", ["info", "--json", "my-package@1.2.3"]);
	expect(pkgData).toEqual({
		name: "my-package",
		version: "1.2.3",
	});
});

it("should return null when using ignoreUnpublished", async () => {
	expect.assertions(1);
	const pkgData = await npmInfo("unpublished@1.2.3", { ignoreUnpublished: true });
	expect(pkgData).toBeNull();
});

it("should cache results", async () => {
	expect.assertions(1);
	await npmInfo("my-package@1");
	await npmInfo("my-package@2");
	await npmInfo("my-package@1");
	expect(mockSpawn).toHaveBeenCalledTimes(2);
});

it("should cache ignoreUnpublished", async () => {
	expect.assertions(1);
	await npmInfo("unpublished@1", { ignoreUnpublished: true });
	await npmInfo("unpublished@2", { ignoreUnpublished: true });
	await npmInfo("unpublished@1", { ignoreUnpublished: true });
	expect(mockSpawn).toHaveBeenCalledTimes(2);
});

it("should throw custom error if an error is returned by npm info", async () => {
	expect.assertions(1);
	await expect(() => npmInfo("unpublished@1.2.3")).rejects.toThrow("Mock summary");
});

it("should handle garbade data from registry", async () => {
	expect.assertions(1);
	await expect(() => npmInfo("unpublished-garbage@1.2.3")).rejects.toThrow("mock error");
});

it("should throw original error for other exceptions", async () => {
	expect.assertions(1);
	await expect(() => npmInfo("exception")).rejects.toThrow("Unrelated exception");
});

describe("isNpmInfoError()", () => {
	it("should return true if error contains npm info error data", () => {
		expect.assertions(1);
		const error = new Error("mock error") as Error & NpmInfoError;
		error.code = "E404";
		error.summary = "summary";
		error.detail = "detail";
		expect(isNpmInfoError(error)).toBeTruthy();
	});

	it("should return false for errors without npm info error data", () => {
		expect.assertions(1);
		const error = new Error("mock error");
		expect(isNpmInfoError(error)).toBeFalsy();
	});
});
