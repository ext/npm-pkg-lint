import { directory, filename, rcfile } from "./helpers";

const regexp: RegExp[] = [
	directory(".eslintcache"),
	filename(".eslintignore"),
	rcfile(`.eslintrc`),
];

export default regexp;
