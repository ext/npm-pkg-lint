import { execa } from "execa";
import PackageJson from "../types/package-json";

const cache: Map<string, PackageJson> = new Map();

export async function npmInfo(pkg: string): Promise<PackageJson> {
	const cached = cache.get(pkg);
	if (cached) {
		return cached;
	}

	const result = await execa("npm", ["info", "--json", pkg]);
	const pkgData: PackageJson = JSON.parse(result.stdout);
	cache.set(pkg, pkgData);
	return pkgData;
}
