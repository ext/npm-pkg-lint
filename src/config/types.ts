/**
 * Options available in the configuration file.
 *
 * @public
 */
export interface UserConfig {
	/** Dependencies explicitly allowed even if they would yield an error */
	readonly allowDependencies?: string[];

	/** Filenames or globs explicitly allowed in the tarball */
	readonly allowFiles?: string[];

	/** Allow production dependencies to `@types/*` */
	readonly allowTypesDependencies?: boolean;

	/** Ignore errors for missing fields */
	readonly ignoreMissingFields?: boolean;

	/** Ignore error for outdated node version, optionally restricted to a major version */
	readonly ignoreNodeVersion?: boolean | number;
}
