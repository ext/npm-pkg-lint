interface UrlObject {
	type?: string;
	name?: string;
	url?: string;
	email?: string;
}

interface RepositoryObject {
	type?: string;
	url?: string;
	directory?: unknown;
}

/**
 * @internal
 */
export interface PackageJsonExports {
	[key: string]: string | null | PackageJsonExports;
}

export interface PackageJson {
	name: string;
	version: string;
	description?: string;
	keywords?: string[];
	homepage?: string;
	bugs?: string | UrlObject;
	license?: string;
	author?: string | UrlObject;
	repository?: string | RepositoryObject;
	main?: string;
	browser?: string | Record<string, string | false>;
	module?: string;
	"jsnext:main"?: string;
	exports?: string | null | PackageJsonExports;
	types?: string;
	typings?: string;
	bin?: string | Record<string, string>;
	man?: string | string[];
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
	bundledDependencies?: Record<string, string>;
	optionalDependencies?: Record<string, string>;
	engines?: Record<string, string>;

	[key: string]:
		| undefined
		| null
		| string
		| string[]
		| Record<string, string>
		| Record<string, string | false>
		| PackageJsonExports
		| UrlObject;
}
