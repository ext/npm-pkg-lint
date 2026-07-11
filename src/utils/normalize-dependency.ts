/** @internal */
export interface PackageDependency {
	/** key from the dependency object */
	key: string;
	/** normalized npm package name (often same as key) */
	name: string;
	/** version specifier */
	version: string;
}

export function normalizeDependency(key: string, value: string): PackageDependency {
	if (value.startsWith("npm:")) {
		const spec = value.slice("npm:".length);
		const [name, version = ""] = spec.split(/(?<=.)@/, 2);
		return { key, name, version };
	}
	return {
		key,
		name: key,
		version: value,
	};
}
