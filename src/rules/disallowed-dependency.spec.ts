import { PackageJson } from "../types";
import { isDisallowedDependency } from "./disallowed-dependency";

const pkg: PackageJson = {
	name: "mock-package",
	version: "1.2.3",
};

it("should disallow scopes", () => {
	expect.assertions(1);
	expect(isDisallowedDependency(pkg, "@types/foo")).toBeTruthy();
});

it("should disallow exact package name", () => {
	expect.assertions(1);
	expect(isDisallowedDependency(pkg, "jake")).toBeTruthy();
});

it("should disallow package prefix", () => {
	expect.assertions(1);
	expect(isDisallowedDependency(pkg, "cypress-plugin-axe")).toBeTruthy();
});

describe("package list", () => {
	it.each([
		"babel-core",
		"eslint",
		"eslint-config-foobar",
		"eslint-formatter-foobar",
		"eslint-plugin-foobar",
		"@scope/eslint-config",
		"@scope/eslint-formatter",
		"@scope/eslint-plugin",
		"grunt",
		"grunt-contrib-foobar",
		"grunt-foobar",
		"gulp",
		"gulp-foobar",
		"html-validate",
		"html-validate-foobar",
		"jest",
		"jest-cli",
		"jest-transform-stub",
		"babel-jest",
		"ts-jest",
		"@jest/core",
		"mocha",
		"prettier",
		"prettier-config-foobar",
		"prettier-plugin-foobar",
		"@scope/prettier-config-foobar",
		"@scope/prettier-plugin-foobar",
		"ts-node",
		"typescript",
		"webpack",
		"@babel/foobar",
		"@types/foobar",
	])("%s", (dependency) => {
		expect.assertions(1);
		expect(isDisallowedDependency(pkg, dependency)).toBeTruthy();
	});

	it.each(["@babel/code-frame"])("%s", (dependency) => {
		expect.assertions(1);
		expect(isDisallowedDependency(pkg, dependency)).toBeFalsy();
	});
});

it("should allow eslint-* if package keywords includes eslint", () => {
	expect.assertions(7);
	const eslintPkg: PackageJson = {
		...pkg,
		keywords: ["eslint"],
	};
	expect(isDisallowedDependency(eslintPkg, "eslint")).toBeFalsy();
	expect(isDisallowedDependency(eslintPkg, "eslint-config-foobar")).toBeFalsy();
	expect(isDisallowedDependency(eslintPkg, "eslint-formatter-foobar")).toBeFalsy();
	expect(isDisallowedDependency(eslintPkg, "eslint-plugin-foobar")).toBeFalsy();
	expect(isDisallowedDependency(eslintPkg, "@scope/eslint-config-foobar")).toBeFalsy();
	expect(isDisallowedDependency(eslintPkg, "@scope/eslint-formatter-foobar")).toBeFalsy();
	expect(isDisallowedDependency(eslintPkg, "@scope/eslint-plugin-foobar")).toBeFalsy();
});

it("should allow jest-* if package keywords includes jest", () => {
	expect.assertions(6);
	const eslintPkg: PackageJson = {
		...pkg,
		keywords: ["jest"],
	};
	expect(isDisallowedDependency(eslintPkg, "jest")).toBeFalsy();
	expect(isDisallowedDependency(eslintPkg, "jest-cli")).toBeFalsy();
	expect(isDisallowedDependency(eslintPkg, "jest-transform-stub")).toBeFalsy();
	expect(isDisallowedDependency(eslintPkg, "babel-jest")).toBeFalsy();
	expect(isDisallowedDependency(eslintPkg, "ts-jest")).toBeFalsy();
	expect(isDisallowedDependency(eslintPkg, "@jest/core")).toBeFalsy();
});

it("should allow prettier-* if package keywords includes prettier", () => {
	expect.assertions(5);
	const eslintPkg: PackageJson = {
		...pkg,
		keywords: ["prettier"],
	};
	expect(isDisallowedDependency(eslintPkg, "prettier")).toBeFalsy();
	expect(isDisallowedDependency(eslintPkg, "prettier-config-foobar")).toBeFalsy();
	expect(isDisallowedDependency(eslintPkg, "prettier-plugin-foobar")).toBeFalsy();
	expect(isDisallowedDependency(eslintPkg, "@scope/prettier-config-foobar")).toBeFalsy();
	expect(isDisallowedDependency(eslintPkg, "@scope/prettier-plugin-foobar")).toBeFalsy();
});
