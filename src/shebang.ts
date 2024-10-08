import { type Result } from "./result";
import { type TarballMeta, getFileContent } from "./tarball";
import { type PackageJson } from "./types";

function getBinaries(pkg: PackageJson): string[] {
	if (!pkg.bin) {
		return [];
	}
	return typeof pkg.bin === "string" ? [pkg.bin] : Object.values(pkg.bin);
}

export async function verifyShebang(pkg: PackageJson, tarball: TarballMeta): Promise<Result[]> {
	const results: Result[] = [];
	const binaries = getBinaries(pkg);
	const contents = await getFileContent(tarball, binaries);

	for (const [filePath, content] of Object.entries(contents)) {
		const text = content.toString("utf-8");
		if (/^#!.+?\r?\n/.exec(text)) {
			continue;
		}
		results.push({
			messages: [
				{
					ruleId: "no-missing-shebang",
					severity: 2,
					message: `first line must contain shebang to be executable`,
					line: 1,
					column: 1,
				},
			],
			filePath,
			errorCount: 1,
			warningCount: 0,
			fixableErrorCount: 0,
			fixableWarningCount: 0,
		});
	}

	return results;
}
