import semver from "semver";
import { Severity } from "@html-validate/stylish";
import { type DocumentNode } from "@humanwhocodes/momoa";
import { type Message } from "../message";
import { type PackageJson } from "../types";
import { jsonLocation } from "../utils";

const ruleId = "types-node-matching-engine";
const severity = Severity.ERROR;

export function* typesNodeMatchingEngine(
	pkg: PackageJson,
	pkgAst: DocumentNode,
): Generator<Message> {
	if (!pkg.engines?.node) {
		return;
	}

	for (const source of ["dependencies", "devDependencies", "peerDependencies"] as const) {
		const dependencies = pkg[source] ?? {};
		if (!dependencies["@types/node"]) {
			continue;
		}

		const declaredVersion = dependencies["@types/node"];
		if (declaredVersion === "latest") {
			continue;
		}

		const nodeVersion = semver.minVersion(pkg.engines.node);
		const typesVersion = semver.minVersion(declaredVersion);

		if (!nodeVersion || !typesVersion) {
			continue;
		}

		if (typesVersion.major !== nodeVersion.major) {
			const { line, column } = jsonLocation(pkgAst, "value", source, "@types/node");
			const actualVersion = `v${String(typesVersion.major)}`;
			const expectedVersion = `v${String(nodeVersion.major)}`;
			yield {
				ruleId,
				severity,
				message: `@types/node ${actualVersion} does not equal engines.node ${expectedVersion}`,
				line,
				column,
			};
		}
	}
}
