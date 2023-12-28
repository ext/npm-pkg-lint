import { filename } from "./helpers";

const regexp: RegExp[] = [
	filename("ava.config.js"),
	filename("ava.config.cjs"),
	filename("ava.config.mjs"),
];

export default regexp;
