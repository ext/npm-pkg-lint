import { ValidationError } from "./validation-error";

export function validUrl(key: string, value: unknown): void {
	if (typeof value === "string" && /^https:\/\/.+$/.exec(value)) {
		return;
	} else if (value && typeof value === "object" && "url" in value) {
		validUrl(`${key}.url`, value.url);
	} else {
		throw new ValidationError(validUrl.name, `"${key}" must be a valid url (https only)`);
	}
}
