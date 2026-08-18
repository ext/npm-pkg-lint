import { directory, filename } from "./helpers";

const regexp: RegExp[] = [
	directory(".tsbuildinfo"),
	filename(".tsbuildinfo"),
	filename("tsconfig.json"),
];

export default regexp;
