import { ValidationError } from "./validation-error";

export function typeString(key: string, value: any): void {
	if (typeof value !== "string") {
		throw new ValidationError(typeString.name, `"${key}" must be string`);
	}
}
