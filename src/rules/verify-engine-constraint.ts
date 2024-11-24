import semver, { type SemVer } from "semver";
import { type Message } from "../message";
import { type PackageJson } from "../types";
import { isNpmInfoError, npmInfo } from "../utils";

const ruleId = "invalid-engine-constraint";

async function* getDeepDependencies(
	pkg: PackageJson,
	visited: Set<string>,
	dependency?: string,
): AsyncGenerator<string> {
	if (dependency) {
		if (visited.has(dependency)) {
			return;
		}
		visited.add(dependency);
	}

	const pkgData = dependency ? await npmInfo(dependency, { ignoreUnpublished: true }) : pkg;
	if (!pkgData) {
		return;
	}
	for (let [key, version] of Object.entries(pkgData.dependencies ?? {})) {
		/* handle npm: prefix */
		if (version.startsWith("npm:")) {
			const [newKey, newVersion] = version.slice("npm:".length).split("@", 2);
			key = newKey; // eslint-disable-line sonarjs/updated-loop-counter -- technical debt
			version = newVersion; // eslint-disable-line sonarjs/updated-loop-counter -- technical debt
		}

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
		yield* getDeepDependencies(pkg, visited, deep);
	}
}

async function verifyDependency(
	dependency: string,
	minDeclared: SemVer,
	declaredConstraint: string,
): Promise<Message | null> {
	const pkgData = await npmInfo(dependency, { ignoreUnpublished: true });
	if (!pkgData) {
		return null;
	}
	const constraint = pkgData.engines?.node;
	if (!constraint) {
		return null;
	}

	if (!semver.satisfies(minDeclared, constraint)) {
		return {
			ruleId,
			severity: 2,
			message: `the transitive dependency "${dependency}" (node ${constraint}) does not satisfy the declared node engine "${declaredConstraint}"`,
			line: 1,
			column: 1,
		};
	}

	return null;
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
	const visited = new Set<string>();

	for await (const dependency of getDeepDependencies(pkg, visited)) {
		try {
			const message = await verifyDependency(dependency, minDeclared, declaredConstraint);
			if (message) {
				messages.push(message);
			}
		} catch (err: unknown) {
			if (isNpmInfoError(err) && err.code === "E404") {
				messages.push({
					ruleId,
					severity: 1,
					message: `the transitive dependency "${dependency}" is not published to the NPM registry`,
					line: 1,
					column: 1,
				});
				continue;
			}
			throw err;
		}
	}

	return messages;
}
