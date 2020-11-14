export function typeString(key: string, value: any): void {
	if (typeof value !== "string") {
		throw new Error(`"${key}" must be string`);
	}
}
