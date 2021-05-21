export function typeArray(key: string, value: any): void {
	if (!Array.isArray(value)) {
		throw new Error(`"${key}" must be array`);
	}
	for (const index in value) {
		/* eslint-disable-next-line security/detect-object-injection */
		if (typeof value[index] !== "string") {
			throw new Error(`"${key}[${index}]" must be string`);
		}
	}
}
