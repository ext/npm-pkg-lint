import { isBlacklisted } from "../blacklist";

it("should disallow cache", () => {
	expect.assertions(1);
	expect(isBlacklisted(".tsbuildinfo/foo")).toBeTruthy();
});

it("should disallow tsconfig.json", () => {
	expect.assertions(2);
	expect(isBlacklisted("tsconfig.json")).toBeTruthy();
	expect(isBlacklisted("foo/tsconfig.json")).toBeTruthy();
});

it("should allow .d.ts", () => {
	expect.assertions(2);
	expect(isBlacklisted("foo.d.ts")).toBeFalsy();
	expect(isBlacklisted("bar/foo.d.ts")).toBeFalsy();
});
