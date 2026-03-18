import { Severity } from "@html-validate/stylish";
import { type DocumentNode } from "@humanwhocodes/momoa";
import { type Message } from "../message";
import { type PackageJson } from "../types";
import { jsonLocation } from "../utils";

const ruleId = "no-protocol-dependencies";
const severity = Severity.ERROR;

const disallowed = [
	"bitbucket:",
	"file:",
	"git+file:",
	"git+http:",
	"git+https:",
	"git+ssh:",
	"git:",
	"github:",
	"gitlab:",
	"http:",
	"https:",
	"link:",
];

const depFields = [
	"dependencies",
	"devDependencies",
	"peerDependencies",
	"optionalDependencies",
] as const;

function getProtocol(version: string): string | null {
	for (const protocol of disallowed) {
		if (version.startsWith(protocol)) {
			return protocol;
		}
	}
	return null;
}

/* eslint-disable-next-line security/detect-unsafe-regex -- not sure why this is deemed unsafe */
const githubShorthandRe = /^[A-Za-z][\w-]*\/[\w.-]+(?:#.+)?$/;
const gitUrlRe = /^[^@]+@[^:]+:.+/;

function isGithubShorthand(version: string): boolean {
	return !version.includes(":") && githubShorthandRe.test(version);
}

function isGitUrl(version: string): boolean {
	return gitUrlRe.test(version);
}

export function* noProtocolDependencies(
	pkg: PackageJson,
	pkgAst: DocumentNode,
): Generator<Message> {
	for (const field of depFields) {
		const deps = pkg[field];
		if (!deps) {
			continue;
		}
		for (const [name, version] of Object.entries(deps)) {
			const protocol = getProtocol(version);
			if (protocol) {
				const { line, column } = jsonLocation(pkgAst, "member", field, name);
				yield {
					ruleId,
					severity,
					message: `"${name}" uses the "${protocol}" protocol specifier which is not allowed in published packages`,
					line,
					column,
				};
			} else if (isGithubShorthand(version)) {
				const { line, column } = jsonLocation(pkgAst, "member", field, name);
				yield {
					ruleId,
					severity,
					message: `"${name}" uses the GitHub shorthand "${version}" which is not allowed in published packages`,
					line,
					column,
				};
			} else if (isGitUrl(version)) {
				const { line, column } = jsonLocation(pkgAst, "member", field, name);
				yield {
					ruleId,
					severity,
					message: `"${name}" uses a git URL "${version}" which is not allowed in published packages`,
					line,
					column,
				};
			}
		}
	}
}
