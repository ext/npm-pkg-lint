import { validUrl } from "./valid-url";

it("should not throw error on https string", () => {
	expect.assertions(1);
	expect(() => validUrl("test", "https://example.net")).not.toThrow();
});

it("should not throw error on https url object", () => {
	expect.assertions(1);
	expect(() => validUrl("test", { url: "https://example.net" })).not.toThrow();
});

it("should throw error on missing value", () => {
	expect.assertions(1);
	expect(() => validUrl("test", undefined)).toThrow('"test" must be a valid url (https only)');
});

it("should throw error on invalid type", () => {
	expect.assertions(2);
	expect(() => validUrl("test", ["foo"])).toThrow('"test" must be a valid url (https only)');
	expect(() => validUrl("test", 12)).toThrow('"test" must be a valid url (https only)');
});

it("should throw error when value is not https url", () => {
	expect.assertions(2);
	expect(() => validUrl("test", "http://example.net")).toThrow(
		'"test" must be a valid url (https only)'
	);
	expect(() => validUrl("test", { url: "http://example.net" })).toThrow(
		'"test.url" must be a valid url (https only)'
	);
});
