interface UrlObject {
	type?: string;
	name?: string;
	url?: string;
	email?: string;
}

export default interface PackageJson {
	name: string;
	version: string;
	description?: string;
	keywords?: string[];
	homepage?: string;
	bugs?: string | UrlObject;
	license?: string;
	author?: string | UrlObject;
	repository?: string | UrlObject;
	main?: string;
	browser?: string | Record<string, string | false>;
	module?: string;
	"jsnext:main"?: string;
	typings?: string;
	bin?: string | Record<string, string>;
	man?: string | string[];
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
	bundledDependencies?: Record<string, string>;
	optionalDependencies?: Record<string, string>;

	[key: string]:
		| string
		| string[]
		| Record<string, string>
		| Record<string, string | false>
		| UrlObject;
}
