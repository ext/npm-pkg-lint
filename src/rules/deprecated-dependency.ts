import semver from "semver";
import { type Message } from "../message";
import { type PackageJson } from "../types";
import { npmInfo } from "../utils";
import { isNpmInfoError } from "../utils/npm-info";

const ruleId = "no-deprecated-dependency";

function* getDependencies(pkg: PackageJson): Generator<string> {
	const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = pkg;
	const allDependencies = { ...dependencies, ...devDependencies, ...peerDependencies };
	for (let [key, version] of Object.entries(allDependencies)) {
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
			continue;
		}

		const minVersion = semver.minVersion(version);
		yield `${key}@${minVersion ? minVersion.version : version}`;
	}
}

export async function deprecatedDependency(pkg: PackageJson): Promise<Message[]> {
	const messages: Message[] = [];

	for await (const dependency of getDependencies(pkg)) {
		try {
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
		} catch (err: unknown) {
			if (isNpmInfoError(err) && err.code === "E404") {
				messages.push({
					ruleId,
					severity: 1,
					message: `the dependency "${dependency}" is not published to the NPM registry`,
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
