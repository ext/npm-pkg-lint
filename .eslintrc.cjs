/* This file is managed by @html-validate/eslint-config */
/* Changes may be overwritten */

require("@html-validate/eslint-config/patch/modern-module-resolution");

module.exports = {
	root: true,
	extends: ["@html-validate"],

	parserOptions: {
		/* needed by yocto-queue */
		ecmaVersion: 2022,
	},

	rules: {
		"import/extensions": "off",
		"sonarjs/no-clear-text-protocols": "off",
	},

	overrides: [
		{
			/* ensure cjs and mjs files are linted too */
			files: ["*.cjs", "*.mjs"],
		},
		{
			files: "*.ts",
			extends: ["@html-validate/typescript"],
		},
		{
			files: ["src/**/*.ts"],
			excludedFiles: ["src/**/*.spec.ts", "**/__mocks__/*.ts"],
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ["./tsconfig.json"],
			},
			extends: ["@html-validate/typescript-typeinfo"],
		},
		{
			files: "*.spec.[jt]s",
			excludedFiles: ["cypress/**", "tests/e2e/**"],
			extends: ["@html-validate/jest"],
		},
		{
			/* files which should lint even if project isn't build yet */
			files: ["./*.d.ts", "bin/*.js"],
			rules: {
				"import/export": "off",
				"import/extensions": "off",
				"import/no-unresolved": "off",
			},
		},
	],
};
