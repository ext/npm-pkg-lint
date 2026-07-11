import { expect, it } from "@jest/globals";
import { normalizeDependency } from "./normalize-dependency";

it("should return the key and version unchanged for a regular dependency", () => {
	expect.assertions(1);
	expect(normalizeDependency("foo", "^1.0.0")).toEqual({
		key: "foo",
		name: "foo",
		version: "^1.0.0",
	});
});

it("should extract the name and version from an aliased dependency", () => {
	expect.assertions(1);
	expect(normalizeDependency("aliased", "npm:foo@^1.0.0")).toEqual({
		key: "aliased",
		name: "foo",
		version: "^1.0.0",
	});
});

it("should extract the name and version from an aliased scoped dependency", () => {
	expect.assertions(1);
	expect(normalizeDependency("aliased", "npm:@types/foo@^1.0.0")).toEqual({
		key: "aliased",
		name: "@types/foo",
		version: "^1.0.0",
	});
});

it("should handle an aliased dependency without a version specifier", () => {
	expect.assertions(1);
	expect(normalizeDependency("aliased", "npm:foo")).toEqual({
		key: "aliased",
		name: "foo",
		version: "",
	});
});

it("should handle an aliased scoped dependency without a version specifier", () => {
	expect.assertions(1);
	expect(normalizeDependency("aliased", "npm:@types/foo")).toEqual({
		key: "aliased",
		name: "@types/foo",
		version: "",
	});
});
