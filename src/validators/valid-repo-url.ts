import { ValidationError } from "./validation-error";

function validateType(key: string, value: unknown): void {
	if (typeof value !== "string") {
		throw new ValidationError(validRepoUrl.name, `"${key}.type" must be a string`);
	}
	if (value !== "git") {
		throw new ValidationError(validRepoUrl.name, `"${key}.type" must be "git"`);
	}
}

function validateUrl(key: string, value: unknown): void {
	if (typeof value !== "string") {
		throw new ValidationError(validRepoUrl.name, `"${key}.url" must be a string`);
	}
	if (value.trim() === "") {
		throw new ValidationError(validRepoUrl.name, `"${key}.url" must not be empty`);
	}
	if (value !== value.trim()) {
		throw new ValidationError(
			validRepoUrl.name,
			`"${key}.url" must not have leading or trailing whitespace`,
		);
	}
	const url = new URL(value);
	if (url.protocol === "git+http:" || url.protocol === "http:") {
		throw new ValidationError(
			validRepoUrl.name,
			`"${key}.url" must use "git+https://" instead of "http://"`,
		);
	}
	if (url.protocol !== "git+https:") {
		throw new ValidationError(validRepoUrl.name, `"${key}.url" must use "git+https://" protocol`);
	}
	if (url.host === "") {
		throw new ValidationError(validRepoUrl.name, `"${key}.url" be a valid url`);
	}
}

function validateDirectory(key: string, value: unknown): void {
	if (typeof value !== "string") {
		throw new ValidationError(validRepoUrl.name, `"${key}.directory" must be a string`);
	}
	if (value.trim() === "") {
		throw new ValidationError(
			validRepoUrl.name,
			`"${key}.directory" must be set to non-empty string or the property must be removed`,
		);
	}
}

export function validRepoUrl(key: string, value: unknown): void {
	if (value === undefined) {
		return;
	}
	if (typeof value !== "object" || value === null) {
		throw new ValidationError(
			validRepoUrl.name,
			`"${key}" must be an object with "type" and "url"`,
		);
	}
	if ("type" in value) {
		validateType(key, value.type);
	} else {
		throw new ValidationError(validRepoUrl.name, `"${key}" is missing required "type" property`);
	}
	if ("url" in value) {
		validateUrl(key, value.url);
	} else {
		throw new ValidationError(validRepoUrl.name, `"${key}" is missing required "url" property`);
	}
	if ("directory" in value) {
		validateDirectory(key, value.directory);
	}
}
