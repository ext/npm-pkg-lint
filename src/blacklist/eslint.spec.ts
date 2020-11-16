import { isBlacklisted } from "../blacklist";

it("should disallow cache", () => {
	expect.assertions(1);
	expect(isBlacklisted(".eslintcache/foo")).toBeTruthy();
});

it("should disallow .eslintignore", () => {
	expect.assertions(1);
	expect(isBlacklisted(".eslintignore")).toBeTruthy();
});

it("should disallow .eslintrc variants", () => {
	expect.assertions(6);
	expect(isBlacklisted(".eslintrc")).toBeTruthy();
	expect(isBlacklisted(".eslintrc.cjs")).toBeTruthy();
	expect(isBlacklisted(".eslintrc.js")).toBeTruthy();
	expect(isBlacklisted(".eslintrc.json")).toBeTruthy();
	expect(isBlacklisted(".eslintrc.yaml")).toBeTruthy();
	expect(isBlacklisted(".eslintrc.yml")).toBeTruthy();
});
