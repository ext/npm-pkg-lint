import { ValidationError } from "./validation-error";

export function typeArray(key: string, value: unknown): void {
	if (!Array.isArray(value)) {
		throw new ValidationError(typeArray.name, `"${key}" must be array`);
	}
	/* eslint-disable-next-line @typescript-eslint/no-for-in-array -- technical debt */
	for (const index in value) {
		if (typeof value[index] !== "string") {
			throw new ValidationError(typeArray.name, `"${key}[${index}]" must be string`);
		}
	}
}
