/* This file is managed by @html-validate/eslint-config */
/* Changes may be overwritten */

import defaultConfig from "@html-validate/eslint-config";
import jestConfig from "@html-validate/eslint-config-jest";
import typescriptConfig from "@html-validate/eslint-config-typescript";
import typeinfoConfig from "@html-validate/eslint-config-typescript-typeinfo";

export default [
	...defaultConfig({
		type: "module",
	}),

	typescriptConfig(),
	typeinfoConfig(import.meta.dirname),
	jestConfig(),
];
