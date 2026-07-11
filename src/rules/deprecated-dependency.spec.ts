import { type DocumentNode, parse } from "@humanwhocodes/momoa";
import { beforeEach, expect, it, jest } from "@jest/globals";
import { type VerifyPackageJsonOptions } from "../package-json";
import { PackageJson } from "../types";
import * as npmInfoModule from "../utils/npm-info";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- exists in mock only
// @ts-expect-error
import { npmInfoMockAdd, npmInfoMockClear } from "../utils/npm-info";
import { deprecatedDependency } from "./deprecated-dependency";

jest.mock("../utils/npm-info");

const options: VerifyPackageJsonOptions = {
	allowedDependencies: new Set(),
	ignoreNodeVersion: false,
};

function generateAst(pkg: PackageJson): DocumentNode {
	return parse(JSON.stringify(pkg, null, 2));
}

beforeEach(() => {
	npmInfoMockClear();
});

it("should return error if dependency is deprecated", async () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		dependencies: { foo: "1.0.0" },
	};
	npmInfoMockAdd("foo@1.0.0", {
		name: "foo",
		version: "1.0.0",
		deprecated: "no longer maintained",
	});
	const ast = generateAst(pkg);
	expect(await deprecatedDependency(pkg, ast, options)).toEqual([
		expect.objectContaining({
			ruleId: "no-deprecated-dependency",
			message: '"foo@1.0.0" is deprecated and must not be used',
		}),
	]);
});

it("should skip npm: alias without a version specifier", async () => {
	expect.assertions(2);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		dependencies: { spam: "npm:foo" },
	};
	const npmInfo = jest.spyOn(npmInfoModule, "npmInfo");
	npmInfo.mockClear();
	const ast = generateAst(pkg);
	expect(await deprecatedDependency(pkg, ast, options)).toEqual([]);
	expect(npmInfo).not.toHaveBeenCalled();
});

it("should not return error if dependency is not deprecated", async () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		dependencies: { foo: "1.0.0" },
	};
	npmInfoMockAdd("foo@1.0.0", { name: "foo", version: "1.0.0" });
	const ast = generateAst(pkg);
	expect(await deprecatedDependency(pkg, ast, options)).toEqual([]);
});

it("should ignore packages with file: prefix", async () => {
	expect.assertions(2);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		dependencies: { foo: "file:../foo" },
	};
	const npmInfo = jest.spyOn(npmInfoModule, "npmInfo");
	npmInfo.mockClear();
	const ast = generateAst(pkg);
	expect(await deprecatedDependency(pkg, ast, options)).toEqual([]);
	expect(npmInfo).not.toHaveBeenCalled();
});

it("should ignore @types/node", async () => {
	expect.assertions(2);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		dependencies: { "@types/node": "*" },
	};
	const npmInfo = jest.spyOn(npmInfoModule, "npmInfo");
	npmInfo.mockClear();
	const ast = generateAst(pkg);
	expect(await deprecatedDependency(pkg, ast, options)).toEqual([]);
	expect(npmInfo).not.toHaveBeenCalled();
});

it("should not return error if dependency is explicitly allowed", async () => {
	expect.assertions(2);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		dependencies: { foo: "1.0.0" },
	};
	const npmInfo = jest.spyOn(npmInfoModule, "npmInfo");
	npmInfo.mockClear();
	const ast = generateAst(pkg);
	const allowedOptions: VerifyPackageJsonOptions = {
		allowedDependencies: new Set(["foo"]),
		ignoreNodeVersion: false,
	};
	expect(await deprecatedDependency(pkg, ast, allowedOptions)).toEqual([]);
	expect(npmInfo).not.toHaveBeenCalled();
});

it("should return error if aliased dependency is deprecated", async () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		dependencies: { aliased: "npm:foo@1.0.0" },
	};
	npmInfoMockAdd("foo@1.0.0", {
		name: "foo",
		version: "1.0.0",
		deprecated: "no longer maintained",
	});
	const ast = generateAst(pkg);
	expect(await deprecatedDependency(pkg, ast, options)).toEqual([
		expect.objectContaining({
			ruleId: "no-deprecated-dependency",
			message: '"foo@1.0.0" is deprecated and must not be used',
		}),
	]);
});

it("should check devDependencies and peerDependencies for deprecated packages", async () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		devDependencies: { foo: "1.0.0" },
		peerDependencies: { bar: "1.0.0" },
	};
	npmInfoMockAdd("foo@1.0.0", {
		name: "foo",
		version: "1.0.0",
		deprecated: "no longer maintained",
	});
	npmInfoMockAdd("bar@1.0.0", {
		name: "bar",
		version: "1.0.0",
		deprecated: "no longer maintained",
	});
	const ast = generateAst(pkg);
	expect(await deprecatedDependency(pkg, ast, options)).toEqual([
		expect.objectContaining({
			ruleId: "no-deprecated-dependency",
			message: '"foo@1.0.0" is deprecated and must not be used',
		}),
		expect.objectContaining({
			ruleId: "no-deprecated-dependency",
			message: '"bar@1.0.0" is deprecated and must not be used',
		}),
	]);
});

it("should return warning if a dependency is not published to the registry", async () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		dependencies: { foo: "1.0.0" },
	};
	const npmInfo = jest.spyOn(npmInfoModule, "npmInfo");
	const error = Object.assign(new Error("not found"), {
		code: "E404",
		summary: "Not found",
		detail: "package not found",
	});
	npmInfo.mockRejectedValueOnce(error);
	const ast = generateAst(pkg);
	expect(await deprecatedDependency(pkg, ast, options)).toEqual([
		expect.objectContaining({
			ruleId: "no-deprecated-dependency",
			severity: 1,
			message: '"foo@1.0.0" is not published to the NPM registry',
		}),
	]);
});

it("should not return warning if a devDependency is not published to the registry", async () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		devDependencies: { foo: "1.0.0" },
	};
	const npmInfo = jest.spyOn(npmInfoModule, "npmInfo");
	const error = Object.assign(new Error("not found"), {
		code: "E404",
		summary: "Not found",
		detail: "package not found",
	});
	npmInfo.mockRejectedValueOnce(error);
	const ast = generateAst(pkg);
	expect(await deprecatedDependency(pkg, ast, options)).toEqual([]);
});
