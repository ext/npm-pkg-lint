import { filename } from "./helpers";

const regexp: RegExp[] = [
	filename(".gitattributes"),
	filename(".keep"),
	filename(".gitkeep"),
	filename(".gitmodules"),
];

export default regexp;
