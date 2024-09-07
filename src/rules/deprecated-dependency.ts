import semver from "semver";
import { type Message } from "../message";
import { type PackageJson } from "../types";
import { npmInfo } from "../utils";
import { isNpmInfoError } from "../utils/npm-info";

const ruleId = "no-deprecated-dependency";

interface Dependency {
	name: string;
	version: string;
	spec: string;
	source: "dependencies" | "devDependencies" | "peerDependencies";
}

function createEntry(
	key: string,
	version: string,
	source: Dependency["source"],
): Dependency | null {
	/* handle npm: prefix */
	if (version.startsWith("npm:")) {
		const [newKey, newVersion] = version.slice("npm:".length).split("@", 2);
		key = newKey;
		version = newVersion;
	}

	/* ignore this as this package is sometimes is present as version "*" which
	 * just yields way to many versions to handle causing MaxBuffer errors and
	 * there is another rule to make sure the outermost @types/node package
	 * matches the configured engines */
	if (key === "@types/node") {
		return null;
	}

	const minVersion = semver.minVersion(version);
	return {
		name: key,
		version,
		spec: `${key}@${minVersion ? minVersion.version : version}`,
		source,
	};
}

function* getDependencies(pkg: PackageJson): Generator<Dependency> {
	const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = pkg;
	for (const [key, version] of Object.entries(dependencies)) {
		const entry = createEntry(key, version, "dependencies");
		if (entry) {
			yield entry;
		}
	}
	for (const [key, version] of Object.entries(devDependencies)) {
		const entry = createEntry(key, version, "devDependencies");
		if (entry) {
			yield entry;
		}
	}
	for (const [key, version] of Object.entries(peerDependencies)) {
		const entry = createEntry(key, version, "peerDependencies");
		if (entry) {
			yield entry;
		}
	}
}

export async function deprecatedDependency(pkg: PackageJson): Promise<Message[]> {
	const messages: Message[] = [];

	for await (const dependency of getDependencies(pkg)) {
		try {
			const { deprecated } = await npmInfo(dependency.spec);
			if (!deprecated) {
				continue;
			}

			messages.push({
				ruleId,
				severity: 2,
				message: `"${dependency.spec}" is deprecated and must not be used`,
				line: 1,
				column: 1,
			});
		} catch (err: unknown) {
			if (isNpmInfoError(err) && err.code === "E404" && dependency.source !== "devDependencies") {
				messages.push({
					ruleId,
					severity: 1,
					message: `the dependency "${dependency.spec}" is not published to the NPM registry`,
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
