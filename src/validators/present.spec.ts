import { present } from "./present";

it("should not throw error when value is set", () => {
	expect.assertions(4);
	expect(() => present("test", "foo")).not.toThrow();
	expect(() => present("test", 12)).not.toThrow();
	expect(() => present("test", [])).not.toThrow();
	expect(() => present("test", {})).not.toThrow();
});

it("should throw error when value is not set", () => {
	expect.assertions(2);
	expect(() => present("test", undefined)).toThrow('"test" must be set');
	expect(() => present("test", null)).toThrow('"test" must be set');
});
