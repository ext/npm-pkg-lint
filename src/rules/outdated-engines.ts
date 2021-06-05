import semver from "semver";
import { Severity } from "@html-validate/stylish/dist/severity";
import { Message } from "../message";
import PackageJson from "../types/package-json";

const ruleId = "outdated-engines";
const severity = Severity.ERROR;

interface EOLDescriptor {
	date: string;
}

const EOL: [string, EOLDescriptor][] = [
	["0.10.x", { date: "2016-10-31" }],
	["0.12.x", { date: "2016-12-31" }],
	["4.x.x", { date: "2018-04-30" }],
	["5.x.x", { date: "2016-06-30" }],
	["6.x.x", { date: "2019-04-30" }],
	["7.x.x", { date: "2017-06-30" }],
	["8.x.x", { date: "2019-12-31" }],
	["9.x.x", { date: "2018-06-30" }],
	["10.x.x", { date: "2021-04-30" }],
	["11.x.x", { date: "2019-06-01" }],
];

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

	for (const [version, descriptor] of EOL) {
		const expanded = version.replace(/[xX*]/g, "999");
		const parsed = semver.parse(expanded);
		if (!semver.satisfies(expanded, range)) {
			continue;
		}
		const nodeRelease = parsed.major || `0.${parsed.minor}`;
		const message = `engines.node is satisfied by Node ${nodeRelease} (EOL since ${descriptor.date})`;
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
