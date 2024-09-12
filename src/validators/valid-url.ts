import { ValidationError } from "./validation-error";

export function validUrl(key: string, value: any): void {
	if (typeof value === "string" && /^https:\/\/.+$/.exec(value)) {
		return;
	} else if (value?.url) {
		validUrl(`${key}.url`, value.url);
	} else {
		throw new ValidationError(validUrl.name, `"${key}" must be a valid url (https only)`);
	}
}
