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
import { isDisallowedDependency } from "./rules/disallowed-dependency";
import { isObsoleteDependency } from "./rules/obsolete-dependency";
import { exportsTypesOrder } from "./rules/exports-types-order";
import { outdatedEngines } from "./rules/outdated-engines";
import { verifyEngineConstraint } from "./rules/verify-engine-constraint";
import { typesNodeMatchingEngine } from "./rules/types-node-matching-engine";

export interface VerifyPackageJsonOptions {
	allowTypesDependencies?: boolean;
	ignoreMissingFields?: boolean;
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

function verifyFields(pkg: PackageJson, options: VerifyPackageJsonOptions): Message[] {
	const messages: Message[] = [];

	for (const [field, validators] of Object.entries(fields)) {
		try {
			for (const validator of validators) {
				validator(field, pkg[field]);
			}
		} catch (error) {
			if (
				error instanceof ValidationError &&
				error.validator === present.name &&
				options.ignoreMissingFields
			) {
				continue;
			}
			// istanbul ignore else
			if (error instanceof Error) {
				messages.push({
					ruleId: "package-json-fields",
					severity: 2,
					message: error.message,
					line: 1,
					column: 1,
				});
			} else {
				throw error;
			}
		}
	}

	return messages;
}

function verifyDependencies(pkg: PackageJson, options: VerifyPackageJsonOptions): Message[] {
	const messages: Message[] = [];
	const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = pkg;
	const allDependencies = { ...dependencies, ...devDependencies, ...peerDependencies };

	for (const dependency of Object.keys(dependencies)) {
		/* skip @types/* if explicitly allowed by user */
		if (options.allowTypesDependencies && dependency.match(/^@types\//)) {
			continue;
		}

		if (isDisallowedDependency(pkg, dependency)) {
			messages.push({
				ruleId: "disallowed-dependency",
				severity: 2,
				message: `${dependency} should be a devDependency`,
				line: 1,
				column: 1,
			});
		}
	}

	for (const dependency of Object.keys(allDependencies)) {
		const obsolete = isObsoleteDependency(dependency);
		if (obsolete) {
			messages.push({
				ruleId: "obsolete-dependency",
				severity: 2,
				message: `${dependency} is obsolete and should no longer be used: ${obsolete.message}`,
				line: 1,
				column: 1,
			});
		}
	}

	return messages;
}

export async function verifyPackageJson(
	pkg: PackageJson,
	filePath: string,
	options: VerifyPackageJsonOptions = {},
): Promise<Result[]> {
	const messages: Message[] = [
		...(await verifyEngineConstraint(pkg)),
		...exportsTypesOrder(pkg),
		...verifyFields(pkg, options),
		...verifyDependencies(pkg, options),
		...outdatedEngines(pkg),
		...typesNodeMatchingEngine(pkg),
	];

	if (messages.length === 0) {
		return [];
	}

	return [
		{
			messages,
			filePath,
			errorCount: messages.length,
			warningCount: 0,
			fixableErrorCount: 0,
			fixableWarningCount: 0,
		},
	];
}
