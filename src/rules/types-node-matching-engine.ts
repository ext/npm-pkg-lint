import semver from "semver";
import { Severity } from "@html-validate/stylish";
import { type Message } from "../message";
import { type PackageJson } from "../types";

const ruleId = "types-node-matching-engine";
const severity = Severity.ERROR;

export function* typesNodeMatchingEngine(pkg: PackageJson): Generator<Message> {
	if (!pkg.engines?.node) {
		return;
	}

	const mergedDependencies = {
		...pkg.dependencies,
		...pkg.devDependencies,
		...pkg.peerDependencies,
	};
	if (!mergedDependencies["@types/node"]) {
		return;
	}

	const nodeVersion = semver.minVersion(pkg.engines.node);
	const typesVersion = semver.minVersion(mergedDependencies["@types/node"]);

	if (!nodeVersion || !typesVersion) {
		return;
	}

	if (typesVersion.major !== nodeVersion.major) {
		yield {
			ruleId,
			severity,
			message: `@types/node v${typesVersion.major} does not equal engines.node v${nodeVersion.major}`,
			line: 1,
			column: 1,
		};
	}
}
