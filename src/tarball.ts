import tar, { FileStat } from "tar";
import { isBlacklisted } from "./blacklist";

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
