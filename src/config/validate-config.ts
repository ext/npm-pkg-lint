import { type UserConfig } from "./types";

type Check = (value: unknown) => boolean;

const isStringArray: Check = (value) =>
	Array.isArray(value) && value.every((it) => typeof it === "string");
const isBoolean: Check = (value) => typeof value === "boolean";
const isString: Check = (value) => typeof value === "string";
const isBooleanOrInteger: Check = (value) =>
	typeof value === "boolean" || Number.isSafeInteger(value);

const schema: Record<keyof UserConfig, { check: Check; expected: string }> = {
	allowDependencies: { check: isStringArray, expected: "an array of strings" },
	allowFiles: { check: isStringArray, expected: "an array of strings" },
	allowTypesDependencies: { check: isBoolean, expected: "a boolean" },
	ignoreMissingFields: { check: isBoolean, expected: "a boolean" },
	ignoreNodeVersion: { check: isBooleanOrInteger, expected: "a boolean or an integer" },
	lockfileRegistry: { check: isString, expected: "a string" },
};

/**
 * Validates the default export of a configuration file.
 *
 * @internal
 * @throws If the value is not a valid configuration.
 */
export function validateConfig(value: unknown, filePath: string): UserConfig {
	if (value === undefined) {
		throw new Error(`${filePath}: configuration file must have a default export`);
	}

	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		throw new Error(`${filePath}: default export must be an object`);
	}

	const errors: string[] = [];
	for (const [key, entry] of Object.entries(value)) {
		if (!Object.hasOwn(schema, key)) {
			errors.push(`unknown option "${key}"`);
			continue;
		}
		const { check, expected } = schema[key as keyof UserConfig];
		if (entry !== undefined && !check(entry)) {
			errors.push(`option "${key}" must be ${expected}`);
		}
	}

	if (errors.length > 0) {
		const list = errors.map((it) => `  - ${it}`).join("\n");
		throw new Error(`${filePath}: invalid configuration:\n${list}`);
	}

	return value;
}
