import spawn from "nano-spawn";
import { type PackageJson } from "../types";
import { persistentCacheGet, persistentCacheSet } from "./persistent-cache";

export interface NpmInfo {
	deprecated?: string;
}

export interface NpmInfoError {
	code: string;
	summary: string;
	detail: string;
}

export interface ExecaError extends Error {
	stdout: string;
}

const cache = new Map<string, PackageJson | null>();

function isExecaError(error: unknown): error is ExecaError {
	return Boolean(error && error instanceof Error && "stdout" in error);
}

export function isNpmInfoError(error: unknown): error is NpmInfoError {
	return Boolean(error && error instanceof Error && "summary" in error);
}

function tryParse(maybeJson: string): { error: NpmInfoError } | null {
	try {
		return JSON.parse(maybeJson) as { error: NpmInfoError };
	} catch {
		return null;
	}
}

export async function npmInfo(pkg: string): Promise<PackageJson & NpmInfo>;
export async function npmInfo(
	pkg: string,
	options: { ignoreUnpublished: true },
): Promise<(PackageJson & NpmInfo) | null>;
/* eslint-disable-next-line complexity -- technical debt */
export async function npmInfo(
	pkg: string,
	/* eslint-disable-next-line unicorn/no-object-as-default-parameter -- technical debt, should destruct with defaults */
	options: { ignoreUnpublished: boolean } = { ignoreUnpublished: false },
): Promise<(PackageJson & NpmInfo) | null> {
	const { ignoreUnpublished } = options;
	const cached = cache.get(pkg);
	if (cached === null) {
		if (ignoreUnpublished) {
			return null;
		}
	} else if (cached) {
		return cached;
	}

	const persistent = await persistentCacheGet(pkg);
	if (persistent) {
		return persistent as PackageJson;
	}

	try {
		const result = await spawn("npm", ["info", "--json", pkg]);
		const pkgData = JSON.parse(result.stdout) as PackageJson;
		cache.set(pkg, pkgData);
		await persistentCacheSet(pkg, pkgData);
		return pkgData;
	} catch (err: unknown) {
		if (!isExecaError(err)) {
			throw err;
		}
		const parsed = tryParse(err.stdout);
		if (!parsed) {
			throw err;
		}
		const { code, summary, detail } = parsed.error;

		/* cache for this session but don't store in persistent cache as this
		 * error might be temporary */
		cache.set(pkg, null);

		if (ignoreUnpublished && code === "E404") {
			return null;
		}

		const wrappedError = new Error(summary, { cause: err }) as Error & NpmInfoError;
		wrappedError.code = code;
		wrappedError.summary = summary;
		wrappedError.detail = detail;
		throw wrappedError;
	}
}
