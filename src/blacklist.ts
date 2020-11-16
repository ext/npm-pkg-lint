import blacklist from "./blacklist/index";

export function setupBlacklist(name: string): void {
	blacklist.push(new RegExp(`^${name}-\\d+\\.\\d+\\.\\d+\\.tgz$`));
}

export function isBlacklisted(filename: string): boolean {
	return blacklist.some((entry) => filename.match(entry));
}
