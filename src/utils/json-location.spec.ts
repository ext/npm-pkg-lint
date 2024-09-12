import { codeFrameColumns } from "@babel/code-frame";
import { type DocumentNode, parse } from "@humanwhocodes/momoa";
import { jsonLocation } from "./json-location";

function createJson(json: unknown): { content: string; ast: DocumentNode } {
	const content = JSON.stringify(json, null, 2);
	return { content, ast: parse(content) };
}

function codeframe(content: string, location: { line: number; column: number }): string {
	return codeFrameColumns(content, { start: location, end: location }, { highlightCode: false });
}

it("should find the member in an object", () => {
	expect.assertions(3);
	const { content, ast } = createJson({
		foo: "1",
		a: {
			b: {
				c: "2",
			},
		},
	});
	expect(codeframe(content, jsonLocation(ast, "member", "foo"))).toMatchInlineSnapshot(`
		"  1 | {
		> 2 |   "foo": "1",
		    |   ^
		  3 |   "a": {
		  4 |     "b": {
		  5 |       "c": "2""
	`);
	expect(codeframe(content, jsonLocation(ast, "member", "a", "b"))).toMatchInlineSnapshot(`
		"  2 |   "foo": "1",
		  3 |   "a": {
		> 4 |     "b": {
		    |     ^
		  5 |       "c": "2"
		  6 |     }
		  7 |   }"
	`);
	expect(codeframe(content, jsonLocation(ast, "member", "a", "b", "c"))).toMatchInlineSnapshot(`
		"  3 |   "a": {
		  4 |     "b": {
		> 5 |       "c": "2"
		    |       ^
		  6 |     }
		  7 |   }
		  8 | }"
	`);
});

it("should find the value in an object", () => {
	expect.assertions(3);
	const { content, ast } = createJson({
		foo: "1",
		a: {
			b: {
				c: "2",
			},
		},
	});
	expect(codeframe(content, jsonLocation(ast, "value", "foo"))).toMatchInlineSnapshot(`
		"  1 | {
		> 2 |   "foo": "1",
		    |          ^
		  3 |   "a": {
		  4 |     "b": {
		  5 |       "c": "2""
	`);
	expect(codeframe(content, jsonLocation(ast, "value", "a", "b"))).toMatchInlineSnapshot(`
		"  2 |   "foo": "1",
		  3 |   "a": {
		> 4 |     "b": {
		    |          ^
		  5 |       "c": "2"
		  6 |     }
		  7 |   }"
	`);
	expect(codeframe(content, jsonLocation(ast, "value", "a", "b", "c"))).toMatchInlineSnapshot(`
		"  3 |   "a": {
		  4 |     "b": {
		> 5 |       "c": "2"
		    |            ^
		  6 |     }
		  7 |   }
		  8 | }"
	`);
});
