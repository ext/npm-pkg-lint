import { Result } from "./result";
import { verifyTarball } from "./tarball";
import { verifyPackageJson } from "./package-json";
import { verifyShebang } from "./shebang";
import PackageJson from "./types/package-json";

export async function verify(
	pkg: PackageJson,
	pkgPath: string,
	tarball: string
): Promise<Result[]> {
	return [
		await verifyTarball(pkg, tarball),
		await verifyPackageJson(pkg, pkgPath),
		...(await verifyShebang(pkg, tarball)),
	];
}
