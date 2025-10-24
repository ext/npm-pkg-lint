import { directory, extension } from "./helpers";

const regexp: RegExp[] = [
	directory("__fixtures__"),
	directory("__snapshots__"),
	directory("__tests__"),
	extension(".snap"),
	extension(".spec.[jt]sx?"),
	extension(".spec.js.map"),
	extension(".spec.d.ts"),
	extension(".spec.d.ts.map"),
	extension(".test.[jt]sx?"),
	extension(".test.js.map"),
	extension(".test.d.ts"),
	extension(".test.d.ts.map"),
];

export default regexp;
