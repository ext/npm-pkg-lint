import { isBlacklisted, setupBlacklist } from "./blacklist";

describe("should disallow unittests", () => {
	it.each([
		"dist/file.spec.js",
		"dist/file.spec.jsx",
		"dist/file.spec.js.map",
		"dist/file.spec.ts",
		"dist/file.spec.tsx",
		"dist/file.spec.d.ts",
		"dist/file.spec.d.ts.map",
		"dist/file.test.js",
		"dist/file.test.jsx",
		"dist/file.test.js.map",
		"dist/file.test.ts",
		"dist/file.test.tsx",
		"dist/file.test.d.ts",
		"dist/file.test.d.ts.map",
		"src/__tests__/file.js",
		"src/__fixtures__/file.js",
		"src/__snapshots__/file.js.snap",
	])("%s", (filename) => {
		expect.assertions(1);
		expect(isBlacklisted(filename)).toBeTruthy();
	});
});

it("should ignore package tarball", () => {
	expect.assertions(1);
	setupBlacklist("foobar");
	expect(isBlacklisted("foobar-1.2.3.tgz")).toBeTruthy();
});

describe("should disallow directories", () => {
	it.each(["coverage/index.html", "temp/coverage/index.html"])("%s", (filename) => {
		expect.assertions(1);
		expect(isBlacklisted(filename)).toBeTruthy();
	});
});

describe("Task runners", () => {
	it("should disallow gruntfile", () => {
		expect.assertions(2);
		expect(isBlacklisted("gruntfile.js")).toBeTruthy();
		expect(isBlacklisted("Gruntfile.js")).toBeTruthy();
	});

	it("should disallow gulpfile", () => {
		expect.assertions(6);
		expect(isBlacklisted("gulpfile.js")).toBeTruthy();
		expect(isBlacklisted("Gulpfile.js")).toBeTruthy();
		expect(isBlacklisted("gulpfile.ts")).toBeTruthy();
		expect(isBlacklisted("Gulpfile.ts")).toBeTruthy();
		expect(isBlacklisted("gulpfile.babel.js")).toBeTruthy();
		expect(isBlacklisted("gulpfile.esm.js")).toBeTruthy();
	});

	it("should disallow jakefile", () => {
		expect.assertions(4);
		expect(isBlacklisted("Jakefile")).toBeTruthy();
		expect(isBlacklisted("Jakefile.js")).toBeTruthy();
		expect(isBlacklisted("jakefile")).toBeTruthy();
		expect(isBlacklisted("jakefile.js")).toBeTruthy();
	});
});

describe("CI/CD", () => {
	it("should disallow github", () => {
		expect.assertions(2);
		expect(isBlacklisted(".github/workflows/foo.yml")).toBeTruthy();
		expect(isBlacklisted(".github/FUNDING.md")).toBeTruthy();
	});

	it("should disallow Zuul", () => {
		expect.assertions(6);
		expect(isBlacklisted(".zuul.d/foo.yml")).toBeTruthy();
		expect(isBlacklisted(".zuul.yaml")).toBeTruthy();
		expect(isBlacklisted(".zuul.yml")).toBeTruthy();
		expect(isBlacklisted("zuul.d/foo.yml")).toBeTruthy();
		expect(isBlacklisted("zuul.yaml")).toBeTruthy();
		expect(isBlacklisted("zuul.yml")).toBeTruthy();
	});
});
