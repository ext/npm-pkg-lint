import { isBlacklisted } from "./blacklist";

describe("should disallow rcfiles", () => {
	it.each([
		".eslintrc.json",
		".eslintrc",
		".eslintrc.js",
		".eslintrc.cjs",
		".eslintrc.yaml",
		".eslintrc.yml",
		"subdirectory/.eslintrc.json",
	])("%s", (filename) => {
		expect(isBlacklisted(filename)).toBeTruthy();
	});
});

describe("should disallow unittests", () => {
	it.each([
		"dist/file.spec.js",
		"dist/file.spec.jsx",
		"dist/file.spec.ts",
		"dist/file.spec.tsx",
		"dist/file.test.js",
		"dist/file.test.jsx",
		"dist/file.test.ts",
		"dist/file.test.tsx",
	])("%s", (filename) => {
		expect(isBlacklisted(filename)).toBeTruthy();
	});
});

describe("should disallow directories", () => {
	it.each(["coverage/index.html", "temp/coverage/index.html"])("%s", (filename) => {
		expect(isBlacklisted(filename)).toBeTruthy();
	});
});
