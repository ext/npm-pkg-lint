import { type DocumentNode } from "@humanwhocodes/momoa";
import semver from "semver";
import { type Message } from "../message";
import { type VerifyPackageJsonOptions } from "../package-json";
import { type PackageJson } from "../types";
import { jsonLocation, normalizeDependency, npmInfo } from "../utils";
import { isNpmInfoError } from "../utils/npm-info";

const ruleId = "no-deprecated-dependency";

interface Dependency {
	/** key from the dependency object, e.g. the alias for aliased dependencies */
	key: string;
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
	/* ignore packages with file: prefix */
	if (version.startsWith("file:")) {
		return null;
	}

	/* handle npm: prefix */
	const { name, version: normalizedVersion } = normalizeDependency(key, version);

	if (normalizedVersion === "") {
		return null;
	}

	/* ignore this as this package is sometimes is present as version "*" which
	 * just yields way to many versions to handle causing MaxBuffer errors and
	 * there is another rule to make sure the outermost @types/node package
	 * matches the configured engines */
	if (name === "@types/node") {
		return null;
	}

	const minVersion = semver.minVersion(normalizedVersion);
	return {
		key,
		name,
		version: normalizedVersion,
		spec: `${name}@${minVersion ? minVersion.version : normalizedVersion}`,
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

export async function deprecatedDependency(
	pkg: PackageJson,
	pkgAst: DocumentNode,
	options: VerifyPackageJsonOptions,
): Promise<Message[]> {
	const { allowedDependencies } = options;
	const messages: Message[] = [];

	for (const dependency of getDependencies(pkg)) {
		/* allow explicitly allowed dependencies */
		if (allowedDependencies.has(dependency.name)) {
			continue;
		}

		try {
			const { deprecated } = await npmInfo(dependency.spec);
			if (!deprecated) {
				continue;
			}
			const { line, column } = jsonLocation(pkgAst, "member", dependency.source, dependency.key);
			messages.push({
				ruleId,
				severity: 2,
				message: `"${dependency.spec}" is deprecated and must not be used`,
				line,
				column,
			});
		} catch (err: unknown) {
			if (isNpmInfoError(err) && err.code === "E404") {
				if (dependency.source === "devDependencies") {
					continue;
				}
				const { line, column } = jsonLocation(pkgAst, "member", dependency.source, dependency.key);
				messages.push({
					ruleId,
					severity: 1,
					message: `"${dependency.spec}" is not published to the NPM registry`,
					line,
					column,
				});
				continue;
			}
			throw err;
		}
	}

	return messages;
}
