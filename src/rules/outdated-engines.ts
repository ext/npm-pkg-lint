import { Severity } from "@html-validate/stylish";
import { type DocumentNode } from "@humanwhocodes/momoa";
import semver from "semver";
import { type Message } from "../message";
import { nodeVersions } from "../node-versions";
import { type PackageJson } from "../types";
import { jsonLocation } from "../utils";

const ruleId = "outdated-engines";
const severity = Severity.ERROR;

/* eslint-disable-next-line complexity -- technical debt */
export function* outdatedEngines(
	pkg: PackageJson,
	pkgAst: DocumentNode,
	ignoreNodeVersion: boolean | number,
): Generator<Message> {
	if (!pkg.engines?.node) {
		const { line, column } = pkg.engines
			? jsonLocation(pkgAst, "member", "engines")
			: { line: 1, column: 1 };
		yield {
			ruleId,
			severity,
			message: "Missing engines.node field",
			line,
			column,
		};
		return;
	}

	const { line, column } = jsonLocation(pkgAst, "value", "engines", "node");

	const range = pkg.engines.node;
	if (!semver.validRange(range)) {
		yield {
			ruleId,
			severity,
			message: `engines.node "${range}" is not a valid semver range`,
			line,
			column,
		};
		return;
	}

	if (ignoreNodeVersion === true) {
		return;
	}

	for (const [version, descriptor] of nodeVersions) {
		/* assume the list of versions are sorted: when a version not EOL is found
		 * we stop processing the list, e.g. `>= 18` is OK while Node 18 is not EOL
		 * even if Node 19 is EOL. */
		if (!descriptor.eol) {
			break;
		}

		const expanded = version.replaceAll(/[*Xx]/g, "999");
		if (!semver.satisfies(expanded, range)) {
			continue;
		}

		/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- parsing hardcoded values and covered by unit tests */
		const parsed = semver.parse(expanded)!;

		const { major, minor } = parsed;
		if (ignoreNodeVersion === major) {
			return;
		}

		const nodeRelease = major > 0 ? major : `0.${String(minor)}`;
		const message = `engines.node is satisfied by Node ${String(nodeRelease)} (EOL since ${
			descriptor.eol
		})`;
		yield {
			ruleId,
			severity,
			message,
			line,
			column,
		};
		return;
	}

	/* if we reached this far there was no error silenced by ignoreNodeVersion so
	 * we yield a new error informing that the ignore is no longer needed */
	if (typeof ignoreNodeVersion === "number") {
		const option = String(ignoreNodeVersion);
		const version = `v${String(ignoreNodeVersion)}.x`;
		const message = `--ignore-node-version=${option} used but engines.node="${range}" does not match ${version} or the version is not EOL yet`;
		yield {
			ruleId,
			severity,
			message,
			line,
			column,
		};
	}
}
