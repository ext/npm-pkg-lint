import { codeFrameColumns } from "@babel/code-frame";
import { type Message } from "../message";
import { type Result } from "../result";

const prefix = ["", "WARNING", "ERROR"];

const supportedFilenames = ["package.json", "package-lock.json"];

function supportsCodeFrame(filePath: string): boolean {
	return supportedFilenames.some((name) => filePath.endsWith(name));
}

function getLocation(message: Message): { line: number; column: number } {
	return {
		line: message.line,
		column: message.column - 1,
	};
}

function formatMessage(
	content: string,
	result: Pick<Result, "filePath">,
	message: Message,
): string {
	const preamble = `${prefix[message.severity]}: ${message.message} (${message.ruleId}) at ${
		result.filePath
	}`;
	const formatted = supportsCodeFrame(result.filePath)
		? codeFrameColumns(
				content,
				{ start: getLocation(message), end: getLocation(message) },
				{ highlightCode: false },
			)
		: "";
	return [preamble, formatted].join("\n");
}

function isResultArray(value: Result[] | Generator<Message>): value is Result[] {
	return Array.isArray(value);
}

/**
 * @internal
 */
export function codeframe(content: string, errors: Result[] | Generator<Message>): string {
	if (isResultArray(errors)) {
		return errors
			.flatMap((it) => it.messages.map((jt) => formatMessage(content, it, jt)))
			.join("\n\n");
	}
	const messages = Array.from(errors);
	return messages
		.map((it) => formatMessage(content, { filePath: "package.json" }, it))
		.join("\n\n");
}
