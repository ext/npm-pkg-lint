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
	["0.10.99", { date: "2016-10-31" }],
	["0.12.99", { date: "2016-12-31" }],
	["4.99.99", { date: "2018-04-30" }],
	["5.99.99", { date: "2016-06-30" }],
	["6.99.99", { date: "2019-04-30" }],
	["7.99.99", { date: "2017-06-30" }],
	["8.99.99", { date: "2019-12-31" }],
	["9.99.99", { date: "2018-06-30" }],
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
		const parsed = semver.parse(version);
		if (semver.satisfies(version, range)) {
			yield {
				ruleId,
				severity,
				message: `engines.node is satisfied by Node ${
					parsed.major || `0.${parsed.minor}`
				} (EOL since ${descriptor.date})`,
				line: 1,
				column: 1,
			};
			return;
		}
	}
}
