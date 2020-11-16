function escape(text: string): string {
	return text.replace(/\./, "\\.");
}

function directory(path: string): RegExp {
	return new RegExp(`(^|/)${path}/`);
}

function extension(ext: string): RegExp {
	return new RegExp(`${escape(ext)}$`);
}

function filename(path: string): RegExp {
	return new RegExp(`${escape(path)}$`);
}

function rcfile(base: string): RegExp {
	return new RegExp(`${escape(base)}(\\.(js|cjs|yaml|yml|json))?$`);
}

const blacklist: RegExp[] = [
	/* tests in general */
	directory("coverage"),
	extension("[.-]junit.xml"),
	extension(".spec.[jt]sx?"),
	extension(".spec.d.ts"),
	extension(".test.[jt]sx?"),
	extension(".test.d.ts"),
	filename("junit.xml"),

	/* jest */
	directory("__tests__"),
	directory("__snapshots__"),

	/* eslint */
	rcfile(`.eslintrc`),
	filename(".eslintignore"),

	/* webpack */
	filename("webpack.config.js"),

	/* ci */
	directory(".github"),
	directory(".gitlab"),
	filename(".gitlab-ci.yml"),

	/* editor specific files */
	/~$/ /* emacs */,
	/#.*#$/ /* emacs */,
	directory(".vscode"),
	filename(".vscodeignore"),

	/* misc */
	filename(".ext-prepush"),
	filename(".editorconfig"),
	filename("Gruntfile.js"),
	filename(".htmlvalidate.json"),
	filename(".prettierignore"),
	filename("tsconfig.json"),
];

export function setupBlacklist(name: string): void {
	blacklist.push(new RegExp(`^${name}-\\d+\\.\\d+\\.\\d+\\.tgz$`));
}

export function isBlacklisted(filename: string): boolean {
	return blacklist.some((entry) => filename.match(entry));
}
