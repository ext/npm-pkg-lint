import { isDisallowedDependency } from "./disallowed-dependency";

it("should disallow scopes", () => {
	expect.assertions(1);
	expect(isDisallowedDependency("@types/foo")).toBeTruthy();
});

it("should disallow exact package name", () => {
	expect.assertions(1);
	expect(isDisallowedDependency("eslint")).toBeTruthy();
});

it("should disallow package prefix", () => {
	expect.assertions(1);
	expect(isDisallowedDependency("eslint-config-foobar")).toBeTruthy();
});

describe("package list", () => {
	it.each([
		"babel-core",
		"eslint",
		"eslint-config-foobar",
		"eslint-plugin-foobar",
		"grunt",
		"grunt-contrib-foobar",
		"grunt-foobar",
		"gulp",
		"gulp-foobar",
		"html-validate",
		"html-validate-foobar",
		"jest",
		"mocha",
		"prettier",
		"prettier-plugin-foobar",
		"ts-node",
		"typescript",
		"webpack",
		"@babel/foobar",
		"@types/foobar",
	])("%s", (dependency) => {
		expect.assertions(1);
		expect(isDisallowedDependency(dependency)).toBeTruthy();
	});

	it.each(["@babel/code-frame"])("%s", (dependency) => {
		expect.assertions(1);
		expect(isDisallowedDependency(dependency)).toBeFalsy();
	});
});
