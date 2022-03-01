import { filename } from "./helpers";

/* reserved filenames on windows */
const regexp: RegExp[] = [
	filename("CON"),
	filename("PRN"),
	filename("AUX"),
	filename("NUL"),
	/(^|\/)COM\d/,
	/(^|\/)LPT\d/,
];

export default regexp;
