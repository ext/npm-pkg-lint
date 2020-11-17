import { Result } from "./result";
import { TarballMeta, verifyTarball } from "./tarball";
import { verifyPackageJson, VerifyPackageJsonOptions } from "./package-json";
import { verifyShebang } from "./shebang";
import PackageJson from "./types/package-json";

export type VerifyOptions = VerifyPackageJsonOptions;

export async function verify(
	pkg: PackageJson,
	pkgPath: string,
	tarball: TarballMeta,
	options: VerifyOptions = {}
): Promise<Result[]> {
	return [
		...(await verifyTarball(pkg, tarball)),
		...(await verifyPackageJson(pkg, pkgPath, options)),
		...(await verifyShebang(pkg, tarball)),
	];
}
