import { directory, extension } from "./helpers";

const regexp: RegExp[] = [
	directory("__snapshots__"),
	directory("__tests__"),
	extension(".snap"),
	extension(".spec.[jt]sx?"),
	extension(".spec.d.ts"),
	extension(".spec.js.map"),
	extension(".test.[jt]sx?"),
	extension(".test.d.ts"),
	extension(".test.js.map"),
];

export default regexp;
