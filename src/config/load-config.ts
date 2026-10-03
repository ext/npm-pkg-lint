import path from "node:path";
import { findConfigFile } from "./find-config";
import { importConfig } from "./import-config";
import { type UserConfig } from "./types";
import { validateConfig } from "./validate-config";

/** @internal */
export interface LoadConfigOptions {
	/** Directory to search for the configuration file and to resolve `configFile` against */
	readonly cwd: string;

	/** Explicit configuration file (disables searching) */
	readonly configFile?: string | undefined;
}

/** @internal */
export interface LoadedConfig {
	/** Absolute path to the configuration file */
	readonly filePath: string;
	readonly config: UserConfig;
}

/**
 * Load configuration file.
 *
 * @internal
 * @returns The configuration or `undefined` if no configuration file was found.
 * @throws If an explicit file cannot be loaded or the configuration is invalid.
 */
export async function loadConfig(options: LoadConfigOptions): Promise<LoadedConfig | undefined> {
	const { cwd, configFile } = options;
	const filePath = configFile ? path.resolve(cwd, configFile) : findConfigFile(cwd);
	if (!filePath) {
		return undefined;
	}

	let exported: unknown;
	try {
		exported = await importConfig(filePath);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		throw new Error(`Failed to load configuration file "${filePath}": ${message}`, { cause: err });
	}

	return { filePath, config: validateConfig(exported, filePath) };
}
