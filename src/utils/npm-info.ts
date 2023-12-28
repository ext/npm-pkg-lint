import { execa } from "execa";
import { type PackageJson } from "../types";
import { persistentCacheGet, persistentCacheSet } from "./persistent-cache";

export interface NpmInfo {
	deprecated?: string;
}

const cache = new Map<string, PackageJson>();

export async function npmInfo(pkg: string): Promise<PackageJson & NpmInfo> {
	const cached = cache.get(pkg);
	if (cached) {
		return cached;
	}

	const persistent = await persistentCacheGet(pkg);
	if (persistent) {
		return persistent as PackageJson;
	}

	const result = await execa("npm", ["info", "--json", pkg]);
	const pkgData = JSON.parse(result.stdout) as PackageJson;
	cache.set(pkg, pkgData);
	await persistentCacheSet(pkg, pkgData);
	return pkgData;
}
