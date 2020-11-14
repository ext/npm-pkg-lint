import path from "path";
import PackageJson from "./types/package-json";

function normalize(name: string): string {
	return name.replace("/", "-").replace(/^@/, "");
}

export function tarballLocation(pkg: PackageJson, pkgPath: string): string {
	const name = normalize(pkg.name);
	return path.join(path.dirname(pkgPath), `${name}-${pkg.version}.tgz`);
}
