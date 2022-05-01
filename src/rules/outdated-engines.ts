import semver from "semver";
import { Severity } from "@html-validate/stylish/dist/severity";
import { Message } from "../message";
import { nodeVersions } from "../node-versions";
import PackageJson from "../types/package-json";

const ruleId = "outdated-engines";
const severity = Severity.ERROR;

export function* outdatedEngines(pkg: PackageJson): Generator<Message> {
	if (!pkg.engines || !pkg.engines.node) {
		yield {
			ruleId,
			severity,
			message: "Missing engines.node field",
			line: 1,
			column: 1,
		};
		return;
	}

	const range = pkg.engines.node;
	if (!semver.validRange(range)) {
		yield {
			ruleId,
			severity,
			message: `engines.node "${range}" is not a valid semver range`,
			line: 1,
			column: 1,
		};
		return;
	}

	for (const [version, descriptor] of nodeVersions) {
		if (!descriptor.eol) {
			continue;
		}

		const expanded = version.replace(/[xX*]/g, "999");
		const parsed = semver.parse(expanded);
		if (!semver.satisfies(expanded, range)) {
			continue;
		}
		const nodeRelease = parsed.major || `0.${parsed.minor}`;
		const message = `engines.node is satisfied by Node ${nodeRelease} (EOL since ${descriptor.eol})`;
		yield {
			ruleId,
			severity,
			message,
			line: 1,
			column: 1,
		};
		return;
	}
}
