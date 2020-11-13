export default interface PackageJson {
	name: string;
	version: string;
	main?: string;
	browser?: string;
	module?: string;
	"jsnext:main"?: string;
	typings?: string;
	bin?: string | Record<string, string>;
	man?: string | string[];
}
