import { Severity } from "@html-validate/stylish";
import { type Message } from "../message";
import { type PackageJson, type PackageJsonExports } from "../types";

const ruleId = "exports-types-order";
const severity = Severity.ERROR;

function* validateOrder(
	value: string | PackageJsonExports | null,
	path: string[]
): Generator<Message> {
	if (!value || typeof value === "string") {
		return;
	}

	const keys = Object.keys(value);
	if (keys.length === 0) {
		return;
	}

	if (keys.includes("types") && keys[0] !== "types") {
		const property = path.map((it) => `["${it}"]`).join("");
		yield {
			ruleId,
			severity,
			message: `"types" must be the first condition in "exports${property}"`,
			line: 1,
			column: 1,
		};
	}

	for (const key of keys) {
		yield* validateOrder(value[key], [...path, key]);
	}
}

export function* exportsTypesOrder(pkg: PackageJson): Generator<Message> {
	if (pkg.exports) {
		yield* validateOrder(pkg.exports, []);
	}
}
