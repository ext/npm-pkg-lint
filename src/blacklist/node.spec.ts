import { isBlacklisted } from "../blacklist";

it("should disallow .npmrc", () => {
	expect.assertions(1);
	expect(isBlacklisted(".npmrc")).toBeTruthy();
});

it("should disallow .npmignore", () => {
	expect.assertions(1);
	expect(isBlacklisted(".npmignore")).toBeTruthy();
});

it("should disallow .nmvrc", () => {
	expect.assertions(1);
	expect(isBlacklisted(".nvmrc")).toBeTruthy();
});

it("should disallow lerna.json", () => {
	expect.assertions(1);
	expect(isBlacklisted(".nvmrc")).toBeTruthy();
});

it("should disallow logs", () => {
	expect.assertions(4);
	expect(isBlacklisted("npm-debug.log")).toBeTruthy();
	expect(isBlacklisted("yarn-error.log")).toBeTruthy();
	expect(isBlacklisted("yarn-debug.log")).toBeTruthy();
	expect(isBlacklisted("lerna-debug.log")).toBeTruthy();
});

it("should disallow diagnostic reports", () => {
	expect.assertions(1);
	expect(isBlacklisted("report.20181221.005011.8974.0.001.json")).toBeTruthy();
});
