import { isBlacklisted } from "../blacklist";

it("should disallow .gitattributes", () => {
	expect.assertions(1);
	expect(isBlacklisted(".gitattributes")).toBeTruthy();
});

it("should disallow .gitmodules", () => {
	expect.assertions(1);
	expect(isBlacklisted(".gitmodules")).toBeTruthy();
});

it("should disallow .keep", () => {
	expect.assertions(2);
	expect(isBlacklisted(".keep")).toBeTruthy();
	expect(isBlacklisted("subdir/.keep")).toBeTruthy();
});

it("should disallow .gitkeep", () => {
	expect.assertions(2);
	expect(isBlacklisted(".gitkeep")).toBeTruthy();
	expect(isBlacklisted("subdir/.gitkeep")).toBeTruthy();
});
