import tar, { FileStat } from "tar";
import { isBlacklisted } from "./blacklist";
import { Message } from "./message";
import { Result } from "./result";

export async function getFileList(filename: string): Promise<string[]> {
	const entries: FileStat[] = [];
	await tar.list({
		file: filename,
		strict: true,
		onentry: (entry: FileStat) => entries.push(entry),
	});
	return entries.map((entry) => {
		const filename = (entry.path as unknown) as string;
		return filename.replace(/^package\//, "");
	});
}

export async function blacklistedFiles(filename: string): Promise<string[]> {
	const files = await getFileList(filename);
	return files.filter(isBlacklisted);
}

export async function verifyTarball(filePath: string): Promise<Result> {
	const messages: Message[] = [];

	for (const filename of await blacklistedFiles(filePath)) {
		messages.push({
			ruleId: "no-disallowed-files",
			severity: 2,
			message: `${filename} is not allowed in tarball`,
			line: 1,
			column: 1,
		});
	}

	return {
		messages,
		filePath,
		errorCount: messages.length,
		warningCount: 0,
	};
}
