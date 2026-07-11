import { type PackageJson } from "../../types";

export interface NpmInfoError {
	code: string;
	summary: string;
	detail: string;
}

export function isNpmInfoError(error: unknown): error is NpmInfoError {
	return Boolean(error && error instanceof Error && "summary" in error);
}

const mock = new Map<string, PackageJson>();
let defaultInfo: PackageJson | null = null;

export function npmInfo(pkg: string): Promise<PackageJson> {
	const mocked = mock.get(pkg);
	if (mocked) {
		return Promise.resolve(mocked);
	}
	if (defaultInfo) {
		return Promise.resolve(defaultInfo);
	}
	throw new Error(`No mocked package data for ${pkg}`);
}

export function npmInfoMockClear(): void {
	mock.clear();
}

export function npmInfoMockAdd(pkg: string, pkgData: PackageJson): void {
	mock.set(pkg, pkgData);
}

export function npmInfoMockDefault(pkgData: PackageJson): void {
	/* eslint-disable-next-line unicorn/no-top-level-assignment-in-function -- technical debt, should use explicit state variable */
	defaultInfo = { ...pkgData };
}
