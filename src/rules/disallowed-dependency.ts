/* eslint-disable security/detect-non-literal-regexp -- expected to be non-literal */

import { type PackageJson } from "../types";

function exact(name: string): RegExp {
	return new RegExp(`^${name}$`);
}
function scope(scope: string): RegExp {
	return new RegExp(`^${scope}/`);
}

function prefix(prefix: string): RegExp {
	return new RegExp(`^${prefix}(-.+)?`);
}

function scopedPrefix(prefix: string): RegExp {
	return new RegExp(`^(.*)/${prefix}(-.+)?`);
}

const disallowedDependencies: RegExp[] = [
	exact("ava"),
	exact("jake"),
	exact("tsd"),
	exact("typescript"),
	exact("xo"),
	prefix("babel-core"),
	prefix("cypress"),
	prefix("grunt"),
	prefix("gulp"),
	prefix("html-validate"),
	prefix("jasmine"),
	prefix("mocha"),
	prefix("nyc"),
	prefix("protractor"),
	prefix("ts-node"),
	prefix("webpack"),
	scope("@babel"),
	scope("@tsconfig"),
	scope("@types"),
];

const disallowedEslint: RegExp[] = [
	exact("eslint"),
	exact("typescript-eslint"),
	prefix("eslint-config"),
	prefix("eslint-formatter"),
	prefix("eslint-plugin"),
	scope("@typescript-eslint"),
	scopedPrefix("eslint-config"),
	scopedPrefix("eslint-formatter"),
	scopedPrefix("eslint-plugin"),
];

const disallowedJest: RegExp[] = [
	exact("jest"),
	exact("babel-jest"),
	exact("ts-jest"),
	prefix("jest-"),
	scope("@jest"),
];

const disallowedPrettier: RegExp[] = [
	exact("prettier"),
	prefix("prettier-"),
	scopedPrefix("prettier-"),
];

const allowedDependencies: string[] = [
	"@babel/code-frame",
	"@babel/polyfill",
	"@babel/runtime",
	"gulp-utils",
	"jest-diff",
	"webpack-sources",
];

function match(list: RegExp[], dependency: string): boolean {
	return list.some((it) => dependency.match(it));
}

export function isDisallowedDependency(pkg: PackageJson, dependency: string): boolean {
	/* test if dependency is explicitly listed as allowed */
	if (allowedDependencies.includes(dependency)) {
		return false;
	}

	const keywords = pkg.keywords ?? [];

	/* eslint-* is allowed only if keywords includes "eslint" */
	if (!keywords.includes("eslint") && match(disallowedEslint, dependency)) {
		return true;
	}

	/* jest-* is allowed only if keywords includes "jest" */
	if (!keywords.includes("jest") && match(disallowedJest, dependency)) {
		return true;
	}

	/* prettier-* is allowed only if keywords includes "prettier" */
	if (!keywords.includes("prettier") && match(disallowedPrettier, dependency)) {
		return true;
	}

	/* test if dependency is explicitly listed as disallowed */
	return match(disallowedDependencies, dependency);
}
