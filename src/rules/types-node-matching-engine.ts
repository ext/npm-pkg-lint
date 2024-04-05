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

	const declaredVersion = mergedDependencies["@types/node"];
	if (declaredVersion === "latest") {
		return;
	}

	const nodeVersion = semver.minVersion(pkg.engines.node);
	const typesVersion = semver.minVersion(declaredVersion);

	if (!nodeVersion || !typesVersion) {
		return;
	}

	if (typesVersion.major !== nodeVersion.major) {
		const actualVersion = `v${String(typesVersion.major)}`;
		const expectedVersion = `v${String(nodeVersion.major)}`;
		yield {
			ruleId,
			severity,
			message: `@types/node ${actualVersion} does not equal engines.node ${expectedVersion}`,
			line: 1,
			column: 1,
		};
	}
}
