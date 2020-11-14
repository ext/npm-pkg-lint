import { typeString } from "./type-string";

it("should not throw error when type is string", () => {
	expect.assertions(1);
	expect(() => typeString("test", "foobar")).not.toThrow();
});

it("should throw error when type is not string", () => {
	expect.assertions(5);
	expect(() => typeString("test", undefined)).toThrow('"test" must be string');
	expect(() => typeString("test", null)).toThrow('"test" must be string');
	expect(() => typeString("test", 12)).toThrow('"test" must be string');
	expect(() => typeString("test", {})).toThrow('"test" must be string');
	expect(() => typeString("test", [])).toThrow('"test" must be string');
});
