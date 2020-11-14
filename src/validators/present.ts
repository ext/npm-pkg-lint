export function present(key: string, value: any): void {
	if (typeof value === "undefined" || value === null) {
		throw new Error(`"${key}" must be set`);
	}
}
