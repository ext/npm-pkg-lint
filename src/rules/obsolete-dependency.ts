export interface ObsoleteDependency {
	package: string;
	message: string;
}

const obsolete: ObsoleteDependency[] = [
	{ package: "make-dir", message: `use native "fs.mkdir(..., { recursive: true })" instead` },
	{ package: "mkdirp", message: `use native "fs.mkdir(..., { recursive: true })" instead` },
	{ package: "stable", message: `Array#sort is stable in all current implementations` },
];

export function isObsoleteDependency(dependency: string): ObsoleteDependency | false {
	return obsolete.find((it) => it.package === dependency) ?? false;
}
