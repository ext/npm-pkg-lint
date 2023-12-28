import { directory, filename, rcfile } from "./helpers";

const regexp: RegExp[] = [
	directory(".eslintcache"),
	filename(".eslintignore"),
	rcfile(`.eslintrc`),
	filename("eslint.config.js"),
	filename("eslint.config.cjs"),
	filename("eslint.config.mjs"),
	filename("eslint.config.ts"),
];

export default regexp;
