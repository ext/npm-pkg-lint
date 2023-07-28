import { type PackageJson } from "../../types";

const mock = new Map<string, PackageJson>();
let defaultInfo: PackageJson | null = null;

export async function npmInfo(pkg: string): Promise<PackageJson> {
	const mocked = mock.get(pkg);
	if (mocked) {
		return mocked;
	} else if (defaultInfo) {
		return defaultInfo;
	} else {
		throw new Error(`No mocked package data for ${pkg}`);
	}
}

export function npmInfoMockClear(): void {
	mock.clear();
}

export function npmInfoMockAdd(pkg: string, pkgData: PackageJson): void {
	mock.set(pkg, pkgData);
}

export function npmInfoMockDefault(pkgData: PackageJson): void {
	defaultInfo = { ...pkgData };
}
