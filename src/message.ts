export interface Message {
	ruleId: string;
	severity: number;
	message: string;
	line: number;
	column: number;
}
