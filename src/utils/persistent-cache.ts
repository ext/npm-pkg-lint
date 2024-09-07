import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";

const enabled = os.platform() === "linux";
const cacheRoot = process.env.XDG_CACHE_HOME ?? path.join(os.homedir(), ".cache");
let cacheDir = path.join(cacheRoot, "npm-pkg-lint");

/* istanbul ignore next */
function getFilePath(key: string): string {
	/* eslint-disable-next-line sonarjs/hashing -- technical debt, should use a different algo but should not cause any issues as is either */
	const hash = crypto.createHash("md5").update(key).digest("hex");
	const filename = `${hash.slice(0, 2)}/${hash.slice(2)}.json`;
	return path.join(cacheDir, filename);
}

/* istanbul ignore next */
export async function setCacheDirecory(directory: string): Promise<void> {
	await fs.mkdir(directory, { recursive: true });
	cacheDir = directory;
}

/* istanbul ignore next */
export async function persistentCacheGet(key: string): Promise<unknown> {
	if (!enabled) {
		return null;
	}

	const filePath = getFilePath(key);
	try {
		const content = await fs.readFile(filePath, "utf-8");
		return JSON.parse(content) as unknown;
	} catch (err: unknown) {
		if (err instanceof Error && "code" in err && err.code === "ENOENT") {
			return null;
		}
		throw err;
	}
}

/* istanbul ignore next */
export async function persistentCacheSet(key: string, data: unknown): Promise<void> {
	if (!enabled) {
		return;
	}

	const filePath = getFilePath(key);
	const content = JSON.stringify(data, null, 2);
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, content, "utf-8");
}
