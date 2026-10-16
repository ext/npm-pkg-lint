import { promises as fs } from "node:fs";
import { parse } from "@humanwhocodes/momoa";
import { findUp } from "find-up";
import { type Result } from "./result";
import { type PackageLock, type PackageLockVersion3 } from "./types";
import { jsonLocation } from "./utils";

const DEFAULT_REGISTRY_URL = "https://registry.npmjs.org/";

export interface VerifyPackageLockOptions {
	/** Registry all packages must be resolved from (default: npm registry) */
	lockfileRegistry?: string | undefined;
}

/* trailing slash ensures "https://example.net/npm" does not match "https://example.net/npmfoo/" */
function normalizeRegistry(url: string): string {
	return url.endsWith("/") ? url : `${url}/`;
}

function isErrnoException(err: unknown): err is NodeJS.ErrnoException {
	return err instanceof Error && "code" in err;
}

function isPackageLockVersion3(lockfile: PackageLock): lockfile is PackageLockVersion3 {
	return lockfile.lockfileVersion === 3;
}

function isValidResolved(pkg: { resolved?: string }, registry: string): boolean {
	return pkg.resolved === undefined || pkg.resolved.startsWith(registry);
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

export async function verifyPackageLock(options: VerifyPackageLockOptions = {}): Promise<Result[]> {
	const registry = normalizeRegistry(options.lockfileRegistry ?? DEFAULT_REGISTRY_URL);
	const expected =
		registry === DEFAULT_REGISTRY_URL ? "the npm registry" : `the registry "${registry}"`;
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
		if (isValidResolved(pkg, registry)) {
			continue;
		}
		const { line, column } = jsonLocation(ast, "value", "packages", name, "resolved");
		results.push({
			messages: [
				{
					ruleId: "package-lock-registry",
					severity: 2,
					message: `package "${name}" is resolved from "${String(pkg.resolved)}" instead of ${expected}`,
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

	return results;
}
