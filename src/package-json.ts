import PackageJson from "./types/package-json";
import { Message } from "./message";
import { Result } from "./result";
import { nonempty, present, typeArray, typeString, validUrl } from "./validators";
import { isDisallowedDependency } from "./rules/disallowed-dependency";
import { outdatedEngines } from "./rules/outdated-engines";
import { verifyEngineConstraint } from "./rules/verify-engine-constraint";

export interface VerifyPackageJsonOptions {
	allowTypesDependencies?: boolean;
	ignoreMissingFields?: boolean;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type validator = (key: string, value: any) => void;

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
				validator(field, pkg[field]); // eslint-disable-line security/detect-object-injection
			}
		} catch (error) {
			if (error.validator === present.name && options.ignoreMissingFields) {
				continue;
			}
			messages.push({
				ruleId: "package-json-fields",
				severity: 2,
				message: error.message,
				line: 1,
				column: 1,
			});
		}
	}

	return messages;
}

function verifyDependencies(pkg: PackageJson, options: VerifyPackageJsonOptions): Message[] {
	const messages: Message[] = [];

	for (const dependency of Object.keys(pkg.dependencies || {})) {
		/* skip @types/* if explicitly allowed by user */
		if (options.allowTypesDependencies && dependency.match(/^@types\//)) {
			continue;
		}

		if (isDisallowedDependency(dependency)) {
			messages.push({
				ruleId: "disallowed-dependency",
				severity: 2,
				message: `${dependency} should be a devDependency`,
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
	options: VerifyPackageJsonOptions = {}
): Promise<Result[]> {
	const messages: Message[] = [
		...(await verifyEngineConstraint(pkg)),
		...verifyFields(pkg, options),
		...verifyDependencies(pkg, options),
		...outdatedEngines(pkg),
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
