import { type Message } from "./message";

export interface Result {
	messages: Message[];
	filePath: string;
	errorCount: number;
	warningCount: number;
	fixableErrorCount: number;
	fixableWarningCount: number;
}
