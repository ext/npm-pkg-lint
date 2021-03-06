import semver from "semver";
import { Message } from "../message";
import PackageJson from "../types/package-json";
import { npmInfo } from "../utils";

const ruleId = "invalid-engine-constraint";

async function* getDeepDependencies(pkg: PackageJson, dependency?: string): AsyncGenerator<string> {
	const pkgData = dependency ? await npmInfo(dependency) : pkg;
	for (const [key, value] of Object.entries(pkgData.dependencies ?? {})) {
		const deep = `${key}@${value}`;
		yield deep;
		yield* await getDeepDependencies(pkg, deep);
	}
}

export async function verifyEngineConstraint(pkg: PackageJson): Promise<Message[]> {
	const declaredConstraint = pkg.engines?.node;
	if (!declaredConstraint) {
		return [];
	}

	const minDeclared = semver.minVersion(declaredConstraint);
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
