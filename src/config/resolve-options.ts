import { type VerifyOptions } from "../verify";
import { type UserConfig } from "./types";

/**
 * Options as given on the command line, `undefined`/empty means "not set".
 *
 * @internal
 */
export interface CliOptions {
	readonly allowDependency: string[];
	readonly allowFile: string[];
	readonly allowTypesDependencies?: boolean | undefined;
	readonly ignoreMissingFields?: boolean | undefined;
	readonly ignoreNodeVersion?: boolean | number | undefined;
}

function splitList(values: string[]): string[] {
	return values.flatMap((it) => it.split(","));
}

/**
 * Merge CLI options and configuration into the options used for verification.
 * An option set on the command line takes precedence over the configuration.
 *
 * @internal
 */
export function resolveOptions(cli: CliOptions, config: UserConfig = {}): VerifyOptions {
	const allowedDependencies =
		cli.allowDependency.length > 0 ? splitList(cli.allowDependency) : config.allowDependencies;
	const allowedFiles = cli.allowFile.length > 0 ? splitList(cli.allowFile) : config.allowFiles;

	return {
		allowedDependencies: new Set(allowedDependencies),
		allowedFiles: allowedFiles ?? [],
		allowTypesDependencies: cli.allowTypesDependencies ?? config.allowTypesDependencies,
		ignoreMissingFields: cli.ignoreMissingFields ?? config.ignoreMissingFields,
		ignoreNodeVersion: cli.ignoreNodeVersion ?? config.ignoreNodeVersion ?? false,
	};
}
