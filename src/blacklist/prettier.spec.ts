import { isBlacklisted } from "../blacklist";

it("should disallow .prettierignore", () => {
	expect.assertions(1);
	expect(isBlacklisted(".prettierignore")).toBeTruthy();
});

it("should disallow .prettierrc variants", () => {
	expect.assertions(6);
	expect(isBlacklisted(".prettierrc")).toBeTruthy();
	expect(isBlacklisted(".prettierrc.cjs")).toBeTruthy();
	expect(isBlacklisted(".prettierrc.js")).toBeTruthy();
	expect(isBlacklisted(".prettierrc.json")).toBeTruthy();
	expect(isBlacklisted(".prettierrc.yaml")).toBeTruthy();
	expect(isBlacklisted(".prettierrc.yml")).toBeTruthy();
});
