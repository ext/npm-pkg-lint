import blacklist from "./blacklist/index";

export function setupBlacklist(name: string): void {
	/* eslint-disable-next-line security/detect-non-literal-regexp -- expected to be non-literal */
	blacklist.push(new RegExp(`^${name}-\\d+\\.\\d+\\.\\d+\\.tgz$`));
}

export function isBlacklisted(filename: string): boolean {
	return blacklist.some((entry) => filename.match(entry));
}
