/* This file is managed by @html-validate/eslint-config */
/* Changes may be overwritten */

import path from "node:path";
import { fileURLToPath } from "node:url";
import defaultConfig from "@html-validate/eslint-config";
import jestConfig from "@html-validate/eslint-config-jest";
import typescriptConfig from "@html-validate/eslint-config-typescript";
import typescriptTypeinfoConfig from "@html-validate/eslint-config-typescript-typeinfo";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default [
	{
		name: "Ignored files",
		ignores: [
			"**/coverage/**",
			"**/dist/**",
			"**/node_modules/**",
			"**/out/**",
			"**/public/assets/**",
			"**/temp/**",
		],
	},

	...defaultConfig,

	{
		name: "@html-validate/eslint-config-typescript",
		files: ["**/*.{ts,cts,mts}"],
		...typescriptConfig,
	},

	{
		name: "@html-validate/eslint-config-typeinfo",
		files: ["src/**/*.ts"],
		ignores: ["src/**/*.spec.ts"],
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: rootDir,
				projectService: true,
			},
		},
		...typescriptTypeinfoConfig,
	},

	{
		name: "@html-validate/eslint-config-jest",
		files: ["**/*.spec.[jt]s"],
		ignores: ["cypress/**", "tests/e2e/**"],
		...jestConfig,
	},

	{
		name: "local",
		rules: {
			"sonarjs/no-clear-text-protocols": "off",
		},
	},
];
