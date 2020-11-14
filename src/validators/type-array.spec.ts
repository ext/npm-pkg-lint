import { typeArray } from "./type-array";

it("should not throw error when type is array", () => {
	expect.assertions(1);
	expect(() => typeArray("test", ["foobar"])).not.toThrow();
});

it("should throw error when type is not array", () => {
	expect.assertions(5);
	expect(() => typeArray("test", undefined)).toThrow('"test" must be array');
	expect(() => typeArray("test", "foobar")).toThrow('"test" must be array');
	expect(() => typeArray("test", null)).toThrow('"test" must be array');
	expect(() => typeArray("test", 12)).toThrow('"test" must be array');
	expect(() => typeArray("test", {})).toThrow('"test" must be array');
});

it("should throw error when type is not array of strings", () => {
	expect.assertions(3);
	expect(() => typeArray("test", [0])).toThrow('"test[0]" must be string');
	expect(() => typeArray("test", [null])).toThrow('"test[0]" must be string');
	expect(() => typeArray("test", [{}])).toThrow('"test[0]" must be string');
});
