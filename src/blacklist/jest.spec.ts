import { isBlacklisted } from "../blacklist";

it("should disallow everything in __snapshots__", () => {
	expect.assertions(1);
	expect(isBlacklisted("__snapshots__/foo.txt")).toBeTruthy();
});

it("should disallow everything in __tests__", () => {
	expect.assertions(1);
	expect(isBlacklisted("__tests__/foo.txt")).toBeTruthy();
});

it("should disallow snapshots", () => {
	expect.assertions(1);
	expect(isBlacklisted("foo.spec.js.snap")).toBeTruthy();
});

it("should disallow test files", () => {
	expect.assertions(8);
	expect(isBlacklisted("foo.spec.js")).toBeTruthy();
	expect(isBlacklisted("foo.spec.jsx")).toBeTruthy();
	expect(isBlacklisted("foo.spec.ts")).toBeTruthy();
	expect(isBlacklisted("foo.spec.tsx")).toBeTruthy();
	expect(isBlacklisted("foo.test.js")).toBeTruthy();
	expect(isBlacklisted("foo.test.jsx")).toBeTruthy();
	expect(isBlacklisted("foo.test.ts")).toBeTruthy();
	expect(isBlacklisted("foo.test.tsx")).toBeTruthy();
});

it("should disallow .d.ts for test files", () => {
	expect.assertions(2);
	expect(isBlacklisted("foo.spec.d.ts")).toBeTruthy();
	expect(isBlacklisted("foo.test.d.ts")).toBeTruthy();
});
