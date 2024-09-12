import { type MemberNode, type DocumentNode, type ValueNode } from "@humanwhocodes/momoa";

interface Result {
	value: ValueNode;
	member?: MemberNode;
}

function findNextNode(current: Result, segment: string, datapath: string[]): Result {
	const { value } = current;
	switch (value.type) {
		case "Object": {
			const found = value.members.find((it) => {
				return it.name.type === "String" && it.name.value === segment;
			});
			if (!found) {
				throw new Error(`Failed to find "${datapath.join(".")}" in JSON structure`);
			}
			return { value: found.value, member: found };
		}
		default: {
			throw new Error(
				`Dont know how to handle node type "${value.type}" when searching for "${datapath.join(
					".",
				)}" in JSON structure`,
			);
		}
	}
}

export function jsonLocation(
	ast: DocumentNode,
	pick: "member" | "value",
	...datapath: string[]
): { line: number; column: number } {
	const result = datapath.reduce<Result>(
		(state, segment) => findNextNode(state, segment, datapath),
		{ value: ast.body },
	);

	switch (pick) {
		case "member":
			return result.member?.loc.start ?? { line: 1, column: 1 };
		case "value":
			return result.value.loc.start;
	}
}
