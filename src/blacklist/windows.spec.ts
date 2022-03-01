import { isBlacklisted } from "../blacklist";

it("should disallow CON", () => {
	expect.assertions(2);
	expect(isBlacklisted("CON")).toBeTruthy();
	expect(isBlacklisted("foo/CON")).toBeTruthy();
});

it("should disallow PRN", () => {
	expect.assertions(2);
	expect(isBlacklisted("PRN")).toBeTruthy();
	expect(isBlacklisted("foo/PRN")).toBeTruthy();
});

it("should disallow AUX", () => {
	expect.assertions(2);
	expect(isBlacklisted("AUX")).toBeTruthy();
	expect(isBlacklisted("foo/AUX")).toBeTruthy();
});

it("should disallow NUL", () => {
	expect.assertions(2);
	expect(isBlacklisted("NUL")).toBeTruthy();
	expect(isBlacklisted("foo/NUL")).toBeTruthy();
});

it("should disallow COM", () => {
	expect.assertions(2);
	expect(isBlacklisted("COM1")).toBeTruthy();
	expect(isBlacklisted("foo/COM9")).toBeTruthy();
});

it("should disallow LPT", () => {
	expect.assertions(2);
	expect(isBlacklisted("LPT1")).toBeTruthy();
	expect(isBlacklisted("foo/LPT9")).toBeTruthy();
});
