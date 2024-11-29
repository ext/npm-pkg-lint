import { type DocumentNode } from "@humanwhocodes/momoa";
import { type PackageJson } from "./types";
import { type Message } from "./message";
import { type Result } from "./result";
import {
	nonempty,
	present,
	typeArray,
	typeString,
	ValidationError,
	validRepoUrl,
	validUrl,
} from "./validators";
import { deprecatedDependency } from "./rules/deprecated-dependency";
import { isDisallowedDependency } from "./rules/disallowed-dependency";
import { isObsoleteDependency } from "./rules/obsolete-dependency";
import { exportsTypesOrder } from "./rules/exports-types-order";
import { outdatedEngines } from "./rules/outdated-engines";
import { verifyEngineConstraint } from "./rules/verify-engine-constraint";
import { typesNodeMatchingEngine } from "./rules/types-node-matching-engine";
import { jsonLocation } from "./utils";

export interface VerifyPackageJsonOptions {
	allowedDependencies: Set<string>;
	allowTypesDependencies?: boolean | undefined;
	ignoreMissingFields?: boolean | undefined;
	ignoreNodeVersion: boolean | number;
}

type validator = (key: string, value: unknown) => void;

const fields: Record<string, validator[]> = {
	description: [present, typeString, nonempty],
	keywords: [present, typeArray, nonempty],
	homepage: [present, typeString, validUrl],
	bugs: [present, validUrl],
	license: [present, typeString, nonempty],
	author: [present, nonempty],
	repository: [present, validRepoUrl],
};

/* eslint-disable-next-line sonarjs/cognitive-complexity -- technical debt */
function verifyFields(
	pkg: PackageJson,
	pkgAst: DocumentNode,
	options: VerifyPackageJsonOptions,
): Message[] {
	const messages: Message[] = [];

	for (const [field, validators] of Object.entries(fields)) {
		try {
			for (const validator of validators) {
				validator(field, pkg[field]);
			}
		} catch (error) {
			// istanbul ignore next
			if (!(error instanceof ValidationError)) {
				throw error;
			}
			if (error.validator === present.name && options.ignoreMissingFields) {
				continue;
			}
			const { line, column } =
				error.validator !== present.name
					? jsonLocation(pkgAst, "value", field)
					: { line: 1, column: 1 };
			if (error instanceof Error) {
				messages.push({
					ruleId: "package-json-fields",
					severity: 2,
					message: error.message,
					line,
					column,
				});
			}
		}
	}

	return messages;
}

function getActualDependency(key: string, version: string): string {
	/* handle npm: prefix */
	if (version.startsWith("npm:")) {
		const [name] = version.slice("npm:".length).split("@", 2);
		return name;
	}

	return key;
}

function verifyDependencies(
	pkg: PackageJson,
	pkgAst: DocumentNode,
	options: VerifyPackageJsonOptions,
): Message[] {
	const messages: Message[] = [];
	const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = pkg;

	for (const [key, version] of Object.entries(dependencies)) {
		const dependency = getActualDependency(key, version);

		/* skip dependencies explicitly allowed by the user */
		if (options.allowedDependencies.has(dependency)) {
			continue;
		}

		/* skip @types/* if explicitly allowed by user */
		if (options.allowTypesDependencies && /^@types\//.exec(dependency)) {
			continue;
		}

		if (isDisallowedDependency(pkg, dependency)) {
			const { line, column } = jsonLocation(pkgAst, "member", "dependencies", key);
			const name = key === dependency ? `"${dependency}"` : `"${key}" ("npm:${dependency}")`;
			messages.push({
				ruleId: "disallowed-dependency",
				severity: 2,
				message: `${name} should be a devDependency`,
				line,
				column,
			});
		}
	}

	function verifyObsolete(
		dependency: string,
		source: "dependencies" | "devDependencies" | "peerDependencies",
	): void {
		const obsolete = isObsoleteDependency(dependency);
		if (obsolete) {
			const { line, column } = jsonLocation(pkgAst, "member", source, dependency);
			messages.push({
				ruleId: "obsolete-dependency",
				severity: 2,
				message: `"${dependency}" is obsolete and should no longer be used: ${obsolete.message}`,
				line,
				column,
			});
		}
	}

	for (const dependency of Object.keys(dependencies)) {
		verifyObsolete(dependency, "dependencies");
	}

	for (const dependency of Object.keys(devDependencies)) {
		verifyObsolete(dependency, "devDependencies");
	}

	for (const dependency of Object.keys(peerDependencies)) {
		verifyObsolete(dependency, "peerDependencies");
	}

	return messages;
}

export async function verifyPackageJson(
	pkg: PackageJson,
	pkgAst: DocumentNode,
	filePath: string,
	options: VerifyPackageJsonOptions = { allowedDependencies: new Set(), ignoreNodeVersion: false },
): Promise<Result[]> {
	const { ignoreNodeVersion } = options;

	const messages: Message[] = [
		...(await deprecatedDependency(pkg, pkgAst, options)),
		...(await verifyEngineConstraint(pkg)),
		...exportsTypesOrder(pkg, pkgAst),
		...verifyFields(pkg, pkgAst, options),
		...verifyDependencies(pkg, pkgAst, options),
		...outdatedEngines(pkg, pkgAst, ignoreNodeVersion),
		...typesNodeMatchingEngine(pkg, pkgAst),
	];

	if (messages.length === 0) {
		return [];
	}

	return [
		{
			messages,
			filePath,
			errorCount: messages.filter((it) => it.severity === 2).length,
			warningCount: messages.filter((it) => it.severity === 1).length,
			fixableErrorCount: 0,
			fixableWarningCount: 0,
		},
	];
}
