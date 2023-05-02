import path from "path";
import { type PackageJson } from "./types";

function normalize(name: string): string {
	return name.replace("/", "-").replace(/^@/, "");
}

export function tarballLocation(pkg: PackageJson, pkgPath: string): string {
	const name = normalize(pkg.name);
	return path.join(path.dirname(pkgPath), `${name}-${pkg.version}.tgz`);
}
