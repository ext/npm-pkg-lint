export interface Message {
	ruleId: string;
	severity: 0 | 1 | 2;
	message: string;
	line: number;
	column: number;
}
