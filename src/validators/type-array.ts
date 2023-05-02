export function typeArray(key: string, value: any): void {
	if (!Array.isArray(value)) {
		throw new Error(`"${key}" must be array`);
	}
	/* eslint-disable-next-line @typescript-eslint/no-for-in-array -- technical debt */
	for (const index in value) {
		if (typeof value[index] !== "string") {
			throw new Error(`"${key}[${index}]" must be string`);
		}
	}
}
