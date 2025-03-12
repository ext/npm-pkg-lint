import { type PackageJson } from "../../types";

const mock = new Map<string, PackageJson>();
let defaultInfo: PackageJson | null = null;

export function npmInfo(pkg: string): Promise<PackageJson> {
	const mocked = mock.get(pkg);
	if (mocked) {
		return Promise.resolve(mocked);
	} else if (defaultInfo) {
		return Promise.resolve(defaultInfo);
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
