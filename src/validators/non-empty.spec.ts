import { nonempty } from "./non-empty";

it("should not throw error when value is set", () => {
	expect.assertions(4);
	expect(() => nonempty("test", "foo")).not.toThrow();
	expect(() => nonempty("test", 0)).not.toThrow();
	expect(() => nonempty("test", ["foo"])).not.toThrow();
	expect(() => nonempty("test", { foo: "bar" })).not.toThrow();
});

it("should throw error when value is not set", () => {
	expect.assertions(5);
	expect(() => nonempty("test", undefined)).toThrow('"test" must not be empty');
	expect(() => nonempty("test", null)).toThrow('"test" must not be empty');
	expect(() => nonempty("test", "")).toThrow('"test" must not be empty');
	expect(() => nonempty("test", [])).toThrow('"test" must not be empty');
	expect(() => nonempty("test", {})).toThrow('"test" must not be empty');
});
