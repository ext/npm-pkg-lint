require("@html-validate/eslint-config/patch/modern-module-resolution");

module.exports = {
	extends: ["@html-validate"],

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
	],
};
