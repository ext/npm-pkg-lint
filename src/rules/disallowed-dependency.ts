function exact(name: string): RegExp {
	return new RegExp(`^${name}$`);
}
function scope(scope: string): RegExp {
	return new RegExp(`^${scope}/`);
}

function prefix(prefix: string): RegExp {
	return new RegExp(`^${prefix}(-.+)?`);
}

const disallowedDependencies: RegExp[] = [
	exact("eslint"),
	exact("jake"),
	prefix("babel-core"),
	prefix("cypress"),
	prefix("eslint-config"),
	prefix("eslint-plugin"),
	prefix("grunt"),
	prefix("gulp"),
	prefix("html-validate"),
	prefix("jasmine"),
	prefix("jest"),
	prefix("mocha"),
	prefix("nyc"),
	prefix("prettier"),
	prefix("protractor"),
	prefix("ts-node"),
	prefix("typescript"),
	prefix("webpack"),
	scope("@babel"),
	scope("@types"),
];

const allowedDependencies: string[] = [
	"@babel/code-frame",
	"@babel/polyfill",
	"@babel/runtime",
	"gulp-utils",
	"jest-diff",
	"webpack-sources",
];

export function isDisallowedDependency(dependency: string): boolean {
	/* test if dependency is explicitly listed as allowed */
	if (allowedDependencies.includes(dependency)) {
		return false;
	}

	/* test if dependency is explicitly listed as disallowed */
	return disallowedDependencies.some((it) => dependency.match(it));
}
