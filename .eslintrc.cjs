require("@html-validate/eslint-config/patch/modern-module-resolution");

module.exports = {
	extends: ["@html-validate"],

	rules: {
		"import/extensions": "off",
	},

	overrides: [
		{
			files: "*.ts",
			extends: ["@html-validate/typescript"],
		},
		{
			files: "*.spec.[jt]s",
			excludedFiles: ["cypress/**", "tests/e2e/**"],
			extends: ["@html-validate/jest"],
		},
		{
			files: "bin/*.js",
			rules: {
				/* should lint without errors even if project isn't compiled */
				"import/no-unresolved": "off",
			},
		},
	],
};
