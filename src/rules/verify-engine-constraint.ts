import semver from "semver";
import { type Message } from "../message";
import { type PackageJson } from "../types";
import { npmInfo } from "../utils";

const ruleId = "invalid-engine-constraint";

async function* getDeepDependencies(pkg: PackageJson, dependency?: string): AsyncGenerator<string> {
	const pkgData = dependency ? await npmInfo(dependency) : pkg;
	for (const [key, version] of Object.entries(pkgData.dependencies ?? {})) {
		/* ignore this as this package is sometimes is present as version "*" which
		 * just yields way to many versions to handle causing MaxBuffer errors and
		 * there is another rule to make sure the outermost @types/node package
		 * matches the configured engines */
		if (key === "@types/node") {
			continue;
		}

		const minVersion = semver.minVersion(version);
		const deep = `${key}@${minVersion ? minVersion.version : version}`;

		yield deep;
		yield* getDeepDependencies(pkg, deep);
	}
}

export async function verifyEngineConstraint(pkg: PackageJson): Promise<Message[]> {
	const declaredConstraint = pkg.engines?.node;
	if (!declaredConstraint) {
		return [];
	}

	const minDeclared = semver.minVersion(declaredConstraint);
	if (!minDeclared) {
		throw new Error(`Failed to parse engine constraint "${declaredConstraint}"`);
	}

	const messages: Message[] = [];

	for await (const dependency of getDeepDependencies(pkg)) {
		const pkgData = await npmInfo(dependency);
		const constraint = pkgData.engines?.node;
		if (!constraint) {
			continue;
		}

		if (!semver.satisfies(minDeclared, constraint)) {
			messages.push({
				ruleId,
				severity: 2,
				message: `the transitive dependency "${dependency}" (node ${constraint}) does not satisfy the declared node engine "${declaredConstraint}"`,
				line: 1,
				column: 1,
			});
		}
	}

	return messages;
}
