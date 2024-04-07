import { PackageJson } from "../types";
import * as npmInfoModule from "../utils/npm-info";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- exists in mock only
// @ts-expect-error
import { npmInfoMockClear, npmInfoMockAdd } from "../utils/npm-info";
import { verifyEngineConstraint } from "./verify-engine-constraint";

jest.mock("../utils/npm-info");

beforeEach(() => {
	npmInfoMockClear();
});

it("should return error if direct dependency have mismatched constraint", async () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		dependencies: { foo: "1.0.0" },
		engines: { node: ">= 10" },
	};
	npmInfoMockAdd("foo@1.0.0", { name: "foo", version: "1.0.0", engines: { node: ">= 12" } });
	expect(await verifyEngineConstraint(pkg)).toEqual([
		expect.objectContaining({
			ruleId: "invalid-engine-constraint",
			message:
				'the transitive dependency "foo@1.0.0" (node >= 12) does not satisfy the declared node engine ">= 10"',
		}),
	]);
});

it("should return error if deep dependency have mismatched constraint", async () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		dependencies: { foo: "1.0.0" },
		engines: { node: ">= 10" },
	};
	npmInfoMockAdd("foo@1.0.0", {
		name: "foo",
		version: "1.0.0",
		dependencies: { bar: "1.0.0" },
	});
	npmInfoMockAdd("bar@1.0.0", { name: "bar", version: "1.0.0", engines: { node: ">= 12" } });
	expect(await verifyEngineConstraint(pkg)).toEqual([
		expect.objectContaining({
			ruleId: "invalid-engine-constraint",
			message:
				'the transitive dependency "bar@1.0.0" (node >= 12) does not satisfy the declared node engine ">= 10"',
		}),
	]);
});

it("should not return error if dependency is missing engine constraints", async () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		dependencies: { foo: "1.0.0", bar: "1.0.0" },
		engines: { node: ">= 10" },
	};
	npmInfoMockAdd("foo@1.0.0", { name: "foo", version: "1.0.0" });
	npmInfoMockAdd("bar@1.0.0", { name: "bar", version: "1.0.0", engines: {} });
	expect(await verifyEngineConstraint(pkg)).toEqual([]);
});

it("should not return error if there are no dependencies", async () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		engines: { node: ">= 10" },
	};
	expect(await verifyEngineConstraint(pkg)).toEqual([]);
});

it("should not return error if package does not declare node constraint", async () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		dependencies: {
			foo: "1.0.0",
		},
	};
	npmInfoMockAdd("foo@1.0.0", { name: "foo", version: "1.0.0", engines: { node: ">= 12" } });
	expect(await verifyEngineConstraint(pkg)).toEqual([]);
});

it("should not return error if all dependencies have matching constraints", async () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		dependencies: { foo: "1.0.0" },
		engines: { node: ">= 12" },
	};
	npmInfoMockAdd("foo@1.0.0", {
		name: "foo",
		version: "1.0.0",
		dependencies: { bar: "1.0.0" },
		engines: { node: ">= 12" },
	});
	npmInfoMockAdd("bar@1.0.0", { name: "bar", version: "1.0.0", engines: { node: ">= 12" } });
	expect(await verifyEngineConstraint(pkg)).toEqual([]);
});

it("should ignore @types/node", async () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		dependencies: { "@types/node": "*" },
		engines: { node: ">= 10" },
	};
	const npmInfo = jest.spyOn(npmInfoModule, "npmInfo");
	await verifyEngineConstraint(pkg);
	expect(npmInfo).not.toHaveBeenCalled();
});

it("should handle npm: prefix", async () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "my-app",
		version: "1.0.0",
		dependencies: { spam: "npm:foo@1.0.0" },
		engines: { node: ">= 10" },
	};
	npmInfoMockAdd("foo@1.0.0", {
		name: "foo",
		version: "1.0.0",
		dependencies: { spam: "npm:bar@1.0.0" },
		engines: { node: ">= 12" },
	});
	npmInfoMockAdd("bar@1.0.0", { name: "bar", version: "1.0.0", engines: { node: ">= 12" } });
	expect(await verifyEngineConstraint(pkg)).toEqual([
		expect.objectContaining({
			ruleId: "invalid-engine-constraint",
			message:
				'the transitive dependency "foo@1.0.0" (node >= 12) does not satisfy the declared node engine ">= 10"',
		}),
		expect.objectContaining({
			ruleId: "invalid-engine-constraint",
			message:
				'the transitive dependency "bar@1.0.0" (node >= 12) does not satisfy the declared node engine ">= 10"',
		}),
	]);
});
