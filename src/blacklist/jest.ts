import { directory, extension } from "./helpers";

const regexp: RegExp[] = [
	directory("__snapshots__"),
	directory("__tests__"),
	extension(".snap"),
	extension(".spec.[jt]sx?"),
	extension(".spec.d.ts"),
	extension(".test.[jt]sx?"),
	extension(".test.d.ts"),
];

export default regexp;
