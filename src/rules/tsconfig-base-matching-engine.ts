import { Severity } from "@html-validate/stylish";
import { type DocumentNode } from "@humanwhocodes/momoa";
import semver from "semver";
import { type Message } from "../message";
import { type PackageJson } from "../types";
import { jsonLocation } from "../utils";

const ruleId = "tsconfig-base-matching-engine";
const severity = Severity.ERROR;
const matchDependency = /^@tsconfig\/node(\d+)$/;

/* eslint-disable-next-line complexity -- technical debt */
export function* tsconfigBaseMatchingEngine(
	pkg: PackageJson,
	pkgAst: DocumentNode,
): Generator<Message> {
	if (!pkg.engines?.node) {
		return;
	}

	const nodeVersion = semver.validRange(pkg.engines.node)
		? semver.minVersion(pkg.engines.node, {})
		: null;
	if (!nodeVersion) {
		return;
	}

	for (const source of ["dependencies", "devDependencies", "peerDependencies"] as const) {
		const dependencies = pkg[source] ?? {};

		const tsconfig = Object.keys(dependencies).filter((it) => matchDependency.test(it));
		if (tsconfig.length === 0) {
			continue;
		}

		const [first, ...duplicates] = tsconfig;
		if (duplicates.length > 0) {
			for (const dup of duplicates) {
				const { line, column } = jsonLocation(pkgAst, "member", source, dup);
				yield {
					ruleId,
					severity,
					message: `${dup} and ${first} cannot be used at the same time`,
					line,
					column,
				};
			}
			continue;
		}

		/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- the string already passed when filtering */
		const match = matchDependency.exec(first)!;
		const baseVersion = parseInt(match[1], 10);

		if (baseVersion !== nodeVersion.major) {
			const { line, column } = jsonLocation(pkgAst, "member", source, first);
			const expectedVersion = `v${String(nodeVersion.major)}`;
			yield {
				ruleId,
				severity,
				message: `${first} does not match engines.node ${expectedVersion}`,
				line,
				column,
			};
		}
	}
}
