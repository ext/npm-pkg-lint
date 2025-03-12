import { ValidationError } from "./validation-error";

export function present(key: string, value: unknown): void {
	if (typeof value === "undefined" || value === null) {
		throw new ValidationError(present.name, `"${key}" must be set`);
	}
}
