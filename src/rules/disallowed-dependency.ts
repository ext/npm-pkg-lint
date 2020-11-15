function scope(scope: string): RegExp {
	return new RegExp(`^${scope}/`);
}

function prefix(prefix: string): RegExp {
	return new RegExp(`^${prefix}(-.+)?`);
}

const disallowedDependencies: RegExp[] = [
	prefix("babel-core"),
	prefix("eslint"),
	prefix("grunt"),
	prefix("gulp"),
	prefix("html-validate"),
	prefix("jest"),
	prefix("mocha"),
	prefix("prettier"),
	prefix("ts-node"),
	prefix("typescript"),
	prefix("webpack"),
	scope("@babel"),
	scope("@types"),
];

const allowedDependencies: string[] = ["@babel/code-frame"];

export function isDisallowedDependency(dependency: string): boolean {
	/* test if dependency is explicitly listed as allowed */
	if (allowedDependencies.includes(dependency)) {
		return false;
	}

	/* test if dependency is explicitly listed as disallowed */
	return disallowedDependencies.some((it) => dependency.match(it));
}
