import { promises as fs } from "node:fs";
import { parse } from "@humanwhocodes/momoa";
import { findUp } from "find-up";
import { type Result } from "./result";
import { type PackageLock, type PackageLockVersion3 } from "./types";
import { jsonLocation } from "./utils";

const REGISTRY_URL = "https://registry.npmjs.org/";

function isErrnoException(err: unknown): err is NodeJS.ErrnoException {
	return err instanceof Error && "code" in err;
}

function isPackageLockVersion3(lockfile: PackageLock): lockfile is PackageLockVersion3 {
	return lockfile.lockfileVersion === 3;
}

function isValidResolved(pkg: { resolved?: string }): boolean {
	return pkg.resolved === undefined || pkg.resolved.startsWith(REGISTRY_URL);
}

async function readLockfile(lockfilePath: string): Promise<string | null> {
	try {
		return await fs.readFile(lockfilePath, "utf-8");
	} catch (err) {
		/* this should not really happen as findUp would only return existing
		 * files (technically it could have been removed inbetween) */
		if (isErrnoException(err) && err.code === "ENOENT") {
			return null;
		}
		throw err;
	}
}

export async function verifyPackageLock(): Promise<Result[]> {
	const lockfilePath = await findUp("package-lock.json");
	if (!lockfilePath) {
		return [];
	}

	const content = await readLockfile(lockfilePath);
	if (content === null) {
		return [];
	}

	const lockfile = JSON.parse(content) as PackageLock;
	const ast = parse(content);

	if (!isPackageLockVersion3(lockfile)) {
		const { line, column } = jsonLocation(ast, "value", "lockfileVersion");
		return [
			{
				messages: [
					{
						ruleId: "package-lock-version",
						severity: 2,
						message: `package-lock.json has lockfileVersion ${lockfile.lockfileVersion} but expected 3`,
						line,
						column,
					},
				],
				filePath: lockfilePath,
				errorCount: 1,
				warningCount: 0,
				fixableErrorCount: 0,
				fixableWarningCount: 0,
			},
		];
	}

	const { packages } = lockfile;
	const results: Result[] = [];

	for (const [name, pkg] of Object.entries(packages)) {
		if (pkg.link) {
			continue;
		}
		if (!isValidResolved(pkg)) {
			const { line, column } = jsonLocation(ast, "value", "packages", name, "resolved");
			results.push({
				messages: [
					{
						ruleId: "package-lock-registry",
						severity: 2,
						message: `package "${name}" is resolved from "${String(pkg.resolved)}" instead of the npm registry`,
						line,
						column,
					},
				],
				filePath: lockfilePath,
				errorCount: 1,
				warningCount: 0,
				fixableErrorCount: 0,
				fixableWarningCount: 0,
			});
		}
	}

	return results;
}
