import { filename } from "./helpers";

const regexp: RegExp[] = [
	/(^|\/)(npm|yarn|lerna)-(debug|error)\.log.*$/,
	filename("report.\\d+.\\d+.\\d+.\\d+.\\d+.json"),
	filename(".npmignore"),
	filename(".npmrc"),
	filename(".nvmrc"),
	filename("lerna.json"),
];

export default regexp;
