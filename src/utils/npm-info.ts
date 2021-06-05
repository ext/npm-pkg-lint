import execa from "execa";
import PackageJson from "../types/package-json";

const cache: Map<string, PackageJson> = new Map();

export async function npmInfo(pkg: string): Promise<PackageJson> {
	if (cache.has(pkg)) {
		return cache.get(pkg);
	}

	const result = await execa("npm", ["info", "--json", pkg]);
	const pkgData: PackageJson = JSON.parse(result.stdout);
	cache.set(pkg, pkgData);
	return pkgData;
}
