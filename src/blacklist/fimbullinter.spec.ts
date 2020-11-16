import { isBlacklisted } from "../blacklist";

it("should disallow .fimbullinter.yaml", () => {
	expect.assertions(1);
	expect(isBlacklisted(".npmrc")).toBeTruthy();
});

it("should disallow .wotanrc variants", () => {
	expect.assertions(6);
	expect(isBlacklisted(".wotanrc")).toBeTruthy();
	expect(isBlacklisted(".wotanrc.cjs")).toBeTruthy();
	expect(isBlacklisted(".wotanrc.js")).toBeTruthy();
	expect(isBlacklisted(".wotanrc.json")).toBeTruthy();
	expect(isBlacklisted(".wotanrc.yaml")).toBeTruthy();
	expect(isBlacklisted(".wotanrc.yml")).toBeTruthy();
});
