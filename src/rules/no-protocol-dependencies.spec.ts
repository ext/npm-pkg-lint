import { type DocumentNode, parse } from "@humanwhocodes/momoa";
import { PackageJson } from "../types";
import { codeframe } from "../utils/codeframe";
import { noProtocolDependencies } from "./no-protocol-dependencies";

let pkg: PackageJson;

function generateAst(pkg: PackageJson): { content: string; ast: DocumentNode } {
	const content = JSON.stringify(pkg, null, 2);
	return { content, ast: parse(content) };
}

beforeEach(() => {
	pkg = {
		name: "mock-package",
		version: "1.2.3",
	};
});

it("should report error for file: in dependencies", () => {
	expect.assertions(1);
	pkg.dependencies = { "my-lib": "file:../my-lib" };
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, noProtocolDependencies(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "my-lib" uses the "file:" protocol specifier which is not allowed in published packages (no-protocol-dependencies) at package.json
		  3 |   "version": "1.2.3",
		  4 |   "dependencies": {
		> 5 |     "my-lib": "file:../my-lib"
		    |     ^
		  6 |   }
		  7 | }"
	`);
});

it("should report error for link: in devDependencies", () => {
	expect.assertions(1);
	pkg.devDependencies = { "my-lib": "link:../my-lib" };
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, noProtocolDependencies(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "my-lib" uses the "link:" protocol specifier which is not allowed in published packages (no-protocol-dependencies) at package.json
		  3 |   "version": "1.2.3",
		  4 |   "devDependencies": {
		> 5 |     "my-lib": "link:../my-lib"
		    |     ^
		  6 |   }
		  7 | }"
	`);
});

it("should report error for github: in peerDependencies", () => {
	expect.assertions(1);
	pkg.peerDependencies = { "my-lib": "github:user/repo" };
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, noProtocolDependencies(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "my-lib" uses the "github:" protocol specifier which is not allowed in published packages (no-protocol-dependencies) at package.json
		  3 |   "version": "1.2.3",
		  4 |   "peerDependencies": {
		> 5 |     "my-lib": "github:user/repo"
		    |     ^
		  6 |   }
		  7 | }"
	`);
});

it("should report error for git+https: in optionalDependencies", () => {
	expect.assertions(1);
	pkg.optionalDependencies = { "my-lib": "git+https://github.com/user/repo.git" };
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, noProtocolDependencies(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "my-lib" uses the "git+https:" protocol specifier which is not allowed in published packages (no-protocol-dependencies) at package.json
		  3 |   "version": "1.2.3",
		  4 |   "optionalDependencies": {
		> 5 |     "my-lib": "git+https://github.com/user/repo.git"
		    |     ^
		  6 |   }
		  7 | }"
	`);
});

it("should report errors across multiple fields", () => {
	expect.assertions(1);
	pkg.dependencies = { foo: "file:../foo" };
	pkg.devDependencies = { bar: "github:user/bar" };
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, noProtocolDependencies(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "foo" uses the "file:" protocol specifier which is not allowed in published packages (no-protocol-dependencies) at package.json
		  3 |   "version": "1.2.3",
		  4 |   "dependencies": {
		> 5 |     "foo": "file:../foo"
		    |     ^
		  6 |   },
		  7 |   "devDependencies": {
		  8 |     "bar": "github:user/bar"

		ERROR: "bar" uses the "github:" protocol specifier which is not allowed in published packages (no-protocol-dependencies) at package.json
		   6 |   },
		   7 |   "devDependencies": {
		>  8 |     "bar": "github:user/bar"
		     |     ^
		   9 |   }
		  10 | }"
	`);
});

it("should not report error for normal semver versions", () => {
	expect.assertions(1);
	pkg.dependencies = { lodash: "^4.17.21" };
	pkg.devDependencies = { typescript: "~5.0.0" };
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, noProtocolDependencies(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should not report error for npm: prefix", () => {
	expect.assertions(1);
	pkg.dependencies = { "readable-stream": "npm:readable-stream@^3.0.0" };
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, noProtocolDependencies(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should not report error for npm: prefix with scoped package", () => {
	expect.assertions(1);
	pkg.dependencies = { "readable-stream": "npm:@scope/readable-stream@^3.0.0" };
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, noProtocolDependencies(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should handle when no dependency fields are present", () => {
	expect.assertions(1);
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, noProtocolDependencies(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should report error for GitHub shorthand user/repo", () => {
	expect.assertions(1);
	pkg.dependencies = { "my-lib": "user/my-lib" };
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, noProtocolDependencies(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "my-lib" uses the GitHub shorthand "user/my-lib" which is not allowed in published packages (no-protocol-dependencies) at package.json
		  3 |   "version": "1.2.3",
		  4 |   "dependencies": {
		> 5 |     "my-lib": "user/my-lib"
		    |     ^
		  6 |   }
		  7 | }"
	`);
});

it("should report error for GitHub shorthand with ref", () => {
	expect.assertions(1);
	pkg.dependencies = { "my-lib": "user/my-lib#abc123" };
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, noProtocolDependencies(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "my-lib" uses the GitHub shorthand "user/my-lib#abc123" which is not allowed in published packages (no-protocol-dependencies) at package.json
		  3 |   "version": "1.2.3",
		  4 |   "dependencies": {
		> 5 |     "my-lib": "user/my-lib#abc123"
		    |     ^
		  6 |   }
		  7 | }"
	`);
});

it("should not treat scoped package versions as GitHub shorthand", () => {
	expect.assertions(1);
	pkg.dependencies = { "@scope/pkg": "^1.0.0" };
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, noProtocolDependencies(pkg, ast))).toMatchInlineSnapshot(`""`);
});

it("should report error for git URL", () => {
	expect.assertions(1);
	pkg.dependencies = { "my-lib": "git@github.com:user/my-lib.git" };
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, noProtocolDependencies(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "my-lib" uses a git URL "git@github.com:user/my-lib.git" which is not allowed in published packages (no-protocol-dependencies) at package.json
		  3 |   "version": "1.2.3",
		  4 |   "dependencies": {
		> 5 |     "my-lib": "git@github.com:user/my-lib.git"
		    |     ^
		  6 |   }
		  7 | }"
	`);
});

it("should report error for git URL with different host", () => {
	expect.assertions(1);
	pkg.dependencies = { "my-lib": "git@bitbucket.org:user/my-lib.git" };
	const { content, ast } = generateAst(pkg);
	expect(codeframe(content, noProtocolDependencies(pkg, ast))).toMatchInlineSnapshot(`
		"ERROR: "my-lib" uses a git URL "git@bitbucket.org:user/my-lib.git" which is not allowed in published packages (no-protocol-dependencies) at package.json
		  3 |   "version": "1.2.3",
		  4 |   "dependencies": {
		> 5 |     "my-lib": "git@bitbucket.org:user/my-lib.git"
		    |     ^
		  6 |   }
		  7 | }"
	`);
});

it.each(["bitbucket:", "git+file:", "git+http:", "git+ssh:", "git:", "gitlab:", "http:", "https:"])(
	'should report error for "%s" protocol',
	(protocol) => {
		expect.assertions(1);
		pkg.dependencies = { "my-lib": `${protocol}user/repo` };
		const { content, ast } = generateAst(pkg);
		expect(codeframe(content, noProtocolDependencies(pkg, ast))).toContain(protocol);
	},
);
