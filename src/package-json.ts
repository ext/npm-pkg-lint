import { type PackageJson } from "./types";
import { type Message } from "./message";
import { type Result } from "./result";
import { nonempty, present, typeArray, typeString, ValidationError, validUrl } from "./validators";
import { isDisallowedDependency } from "./rules/disallowed-dependency";
import { exportsTypesOrder } from "./rules/exports-types-order";
import { outdatedEngines } from "./rules/outdated-engines";
import { verifyEngineConstraint } from "./rules/verify-engine-constraint";
import { typesNodeMatchingEngine } from "./rules/types-node-matching-engine";

export interface VerifyPackageJsonOptions {
	allowedDependencies: Set<string>;
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
	repository: [present, validUrl],
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

function getActualDependency(key: string, version: string): string {
	/* handle npm: prefix */
	if (version.startsWith("npm:")) {
		const [name] = version.slice("npm:".length).split("@", 2);
		return name;
	}

	return key;
}

function verifyDependencies(pkg: PackageJson, options: VerifyPackageJsonOptions): Message[] {
	const messages: Message[] = [];

	for (const [key, version] of Object.entries(pkg.dependencies ?? {})) {
		const dependency = getActualDependency(key, version);

		/* skip dependencies explicitly allowed by the user */
		if (options.allowedDependencies.has(dependency)) {
			continue;
		}

		/* skip @types/* if explicitly allowed by user */
		if (options.allowTypesDependencies && dependency.match(/^@types\//)) {
			continue;
		}

		if (isDisallowedDependency(pkg, dependency)) {
			const name = key === dependency ? dependency : `"${key}" ("npm:${dependency}")`;
			messages.push({
				ruleId: "disallowed-dependency",
				severity: 2,
				message: `"${name}" should be a devDependency`,
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
	options: VerifyPackageJsonOptions = { allowedDependencies: new Set() }
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
			errorCount: messages.filter((it) => it.severity === 2).length,
			warningCount: messages.filter((it) => it.severity === 1).length,
			fixableErrorCount: 0,
			fixableWarningCount: 0,
		},
	];
}
