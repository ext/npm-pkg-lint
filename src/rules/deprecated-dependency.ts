import semver from "semver";
import { type Message } from "../message";
import { type PackageJson } from "../types";
import { npmInfo } from "../utils";

const ruleId = "no-deprecated-dependency";

function* getDependencies(pkg: PackageJson): Generator<string> {
	const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = pkg;
	const allDependencies = { ...dependencies, ...devDependencies, ...peerDependencies };
	for (const [key, version] of Object.entries(allDependencies)) {
		/* ignore this as this package is sometimes is present as version "*" which
		 * just yields way to many versions to handle causing MaxBuffer errors and
		 * there is another rule to make sure the outermost @types/node package
		 * matches the configured engines */
		if (key === "@types/node") {
			continue;
		}

		const minVersion = semver.minVersion(version);
		yield `${key}@${minVersion ? minVersion.version : version}`;
	}
}

export async function deprecatedDependency(pkg: PackageJson): Promise<Message[]> {
	const messages: Message[] = [];

	for await (const dependency of getDependencies(pkg)) {
		const { deprecated } = await npmInfo(dependency);
		if (!deprecated) {
			continue;
		}

		messages.push({
			ruleId,
			severity: 2,
			message: `"${dependency}" is deprecated and must not be used`,
			line: 1,
			column: 1,
		});
	}

	return messages;
}
