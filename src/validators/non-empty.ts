function isEmpty(value: any): boolean {
	/* undefined, null and empty string is considered empty */
	return typeof value === "undefined" || value === null || value === "";
}

export function nonempty(key: string, value: any): void {
	if (isEmpty(value)) {
		throw new Error(`"${key}" must not be empty`);
	}

	/* any number is considered set, even 0 */
	if (typeof value === "number") {
		return;
	}

	/* for arrays the array must be populated and each entry but be non-empty */
	if (Array.isArray(value)) {
		if (value.length === 0) {
			throw new Error(`"${key}" must not be empty`);
		}
		for (const index in value) {
			nonempty(`${key}[${index}]`, value[index]); // eslint-disable-line security/detect-object-injection
		}
		return;
	}

	/* object must have at least one one property set */
	const values = Object.values(value);
	if (values.length === 0) {
		throw new Error(`"${key}" must not be empty`);
	}
}
