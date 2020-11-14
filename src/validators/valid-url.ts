export function validUrl(key: string, value: any): void {
	if (typeof value === "string" && value.match(/^https:\/\/.+$/)) {
		return;
	} else if (value && value.url) {
		validUrl(`${key}.url`, value.url);
	} else {
		throw new Error(`"${key}" must be a valid url (https only)`);
	}
}
