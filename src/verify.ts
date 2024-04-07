import { type Result } from "./result";
import { type TarballMeta, verifyTarball } from "./tarball";
import { type VerifyPackageJsonOptions, verifyPackageJson } from "./package-json";
import { verifyShebang } from "./shebang";
import { type PackageJson } from "./types";

export type VerifyOptions = VerifyPackageJsonOptions;

export async function verify(
	pkg: PackageJson,
	pkgPath: string,
	tarball: TarballMeta,
	options: VerifyOptions
): Promise<Result[]> {
	return [
		...(await verifyTarball(pkg, tarball)),
		...(await verifyPackageJson(pkg, pkgPath, options)),
		...(await verifyShebang(pkg, tarball)),
	];
}
