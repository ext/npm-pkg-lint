import { directory, extension, filename, rcfile } from "./helpers";

describe("directory()", () => {
	it("should match all files in given directory", () => {
		expect.assertions(2);
		const regexp = directory("foo");
		expect("foo/a".match(regexp)).toBeTruthy();
		expect("foo/b".match(regexp)).toBeTruthy();
	});

	it("should not match other directories", () => {
		expect.assertions(1);
		const regexp = directory("foo");
		expect("bar/a".match(regexp)).toBeFalsy();
	});

	it("should match nested directory", () => {
		expect.assertions(1);
		const regexp = directory("foo");
		expect("bar/foo/a".match(regexp)).toBeTruthy();
	});

	it("should not match filename with same name as directory", () => {
		expect.assertions(1);
		const regexp = directory("foo");
		expect("foo".match(regexp)).toBeFalsy();
	});
});

describe("extension()", () => {
	it("should match any filename with given extension", () => {
		expect.assertions(2);
		const regexp = extension(".json");
		expect("foo.json".match(regexp)).toBeTruthy();
		expect("bar.json".match(regexp)).toBeTruthy();
	});

	it("should match files in directories", () => {
		expect.assertions(1);
		const regexp = extension(".yml");
		expect("foo/bar.yml".match(regexp)).toBeTruthy();
	});

	it("should only match end of string", () => {
		expect.assertions(1);
		const regexp = extension(".json");
		expect("foo.jsonbar".match(regexp)).toBeFalsy();
	});

	it("should support multiple dots", () => {
		expect.assertions(1);
		const regexp = extension(".spec.d.ts");
		expect("foo.spec.d.ts".match(regexp)).toBeTruthy();
	});

	it("should match literal dot", () => {
		expect.assertions(2);
		const regexp = extension(".yml");
		expect("foo.yml".match(regexp)).toBeTruthy();
		expect("fooxyml".match(regexp)).toBeFalsy();
	});

	it("should handle character class", () => {
		expect.assertions(2);
		const regexp = extension(".spec.[jt]s");
		expect("foo.spec.js".match(regexp)).toBeTruthy();
		expect("foo.spec.ts".match(regexp)).toBeTruthy();
	});

	it("should handle ?", () => {
		expect.assertions(2);
		const regexp = extension(".ya?ml");
		expect("foo.yml".match(regexp)).toBeTruthy();
		expect("foo.yaml".match(regexp)).toBeTruthy();
	});
});

describe("filename()", () => {
	it("should match given filename", () => {
		expect.assertions(1);
		const regexp = filename("tsconfig.json");
		expect("tsconfig.json".match(regexp)).toBeTruthy();
	});

	it("should match file in subdirectory", () => {
		expect.assertions(1);
		const regexp = filename("tsconfig.json");
		expect("foo/tsconfig.json".match(regexp)).toBeTruthy();
	});

	it("should only match full filename", () => {
		expect.assertions(2);
		const regexp = filename("tsconfig.json");
		expect("foo.tsconfig.json".match(regexp)).toBeFalsy();
		expect("tsconfig.json.foo".match(regexp)).toBeFalsy();
	});

	it("should match literal dot", () => {
		expect.assertions(2);
		const regexp = filename("tsconfig.json");
		expect("tsconfig.json".match(regexp)).toBeTruthy();
		expect("tsconfigxjson".match(regexp)).toBeFalsy();
	});

	it("should handle character class", () => {
		expect.assertions(2);
		const regexp = filename("foo.spec.[jt]s");
		expect("foo.spec.js".match(regexp)).toBeTruthy();
		expect("foo.spec.ts".match(regexp)).toBeTruthy();
	});

	it("should handle ?", () => {
		expect.assertions(2);
		const regexp = extension("foo.ya?ml");
		expect("foo.yml".match(regexp)).toBeTruthy();
		expect("foo.yaml".match(regexp)).toBeTruthy();
	});
});

describe("rcfile()", () => {
	it("should match variants", () => {
		expect.assertions(8);
		const regexp = rcfile(".eslintrc");
		expect(".eslintrc".match(regexp)).toBeTruthy();
		expect(".eslintrc.cjs".match(regexp)).toBeTruthy();
		expect(".eslintrc.mjs".match(regexp)).toBeTruthy();
		expect(".eslintrc.js".match(regexp)).toBeTruthy();
		expect(".eslintrc.ts".match(regexp)).toBeTruthy();
		expect(".eslintrc.json".match(regexp)).toBeTruthy();
		expect(".eslintrc.yaml".match(regexp)).toBeTruthy();
		expect(".eslintrc.yml".match(regexp)).toBeTruthy();
	});

	it("should match file in subdirectory", () => {
		expect.assertions(1);
		const regexp = rcfile(".eslintrc");
		expect("foo/.eslintrc.json".match(regexp)).toBeTruthy();
	});
});
