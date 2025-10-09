import { type DocumentNode } from "@humanwhocodes/momoa";
import { type VerifyPackageJsonOptions, verifyPackageJson } from "./package-json";
import { type Result } from "./result";
import { verifyShebang } from "./shebang";
import { type TarballMeta, verifyTarball } from "./tarball";
import { type PackageJson } from "./types";

export type VerifyOptions = VerifyPackageJsonOptions;

export async function verify(
	pkg: PackageJson,
	pkgAst: DocumentNode,
	pkgPath: string,
	tarball: TarballMeta,
	options: VerifyOptions,
): Promise<Result[]> {
	return [
		...(await verifyTarball(pkg, tarball)),
		...(await verifyPackageJson(pkg, pkgAst, pkgPath, options)),
		...(await verifyShebang(pkg, tarball)),
	];
}
