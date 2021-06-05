import execa from "execa";
import { npmInfo } from "./npm-info";

jest.mock("execa");

const mockExeca = execa as unknown as jest.Mock;

beforeEach(() => {
	jest.clearAllMocks();
});

it("should fetch package info", async () => {
	expect.assertions(2);
	mockExeca.mockImplementation(() => ({
		stdout: JSON.stringify({
			name: "my-package",
			version: "1.2.3",
		}),
	}));
	const pkgData = await npmInfo("my-package@1.2.3");
	expect(mockExeca).toHaveBeenCalledWith("npm", ["info", "--json", "my-package@1.2.3"]);
	expect(pkgData).toEqual({
		name: "my-package",
		version: "1.2.3",
	});
});

it("should cache results", async () => {
	expect.assertions(1);
	mockExeca.mockImplementation(() => ({
		stdout: "{}",
	}));
	await npmInfo("my-package@1");
	await npmInfo("my-package@2");
	await npmInfo("my-package@1");
	expect(mockExeca).toHaveBeenCalledTimes(2);
});
