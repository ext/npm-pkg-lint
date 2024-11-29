import { parse, type DocumentNode } from "@humanwhocodes/momoa";
import { verifyPackageJson } from "./package-json";
import { PackageJson } from "./types";
import { codeframe } from "./utils/codeframe";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- it exists in the mock only
// @ts-expect-error
import { npmInfoMockDefault } from "./utils/npm-info";

jest.mock("./utils/npm-info");

let pkg: PackageJson & Required<Pick<PackageJson, "engines">>;

function generateAst(pkg: PackageJson): { content: string; ast: DocumentNode } {
	const content = JSON.stringify(pkg, null, 2);
	return { content, ast: parse(content) };
}

beforeEach(() => {
	pkg = {
		name: "mock-pkg",
		version: "1.2.3",
		description: "description",
		keywords: ["test"],
		homepage: "https://example.net",
		bugs: "https://example.net",
		license: "UNLICENSED",
		author: "Fred Flintstone <fred.flintstone@example.net>",
		repository: { type: "git", url: "git+https://git.example.net/test-case.git" },
		engines: {
			node: ">= 18",
		},
	};
	npmInfoMockDefault(pkg);
});

it("should not return errors if package.json is well formed (strings only)", async () => {
	expect.assertions(1);
	const { ast } = generateAst(pkg);
	const results = await verifyPackageJson(pkg, ast, "package.json");
	expect(results).toEqual([]);
});

it("should not return errors if package.json has no dependencies", async () => {
	expect.assertions(1);
	delete pkg.dependencies;
	const { ast } = generateAst(pkg);
	const results = await verifyPackageJson(pkg, ast, "package.json");
	expect(results).toEqual([]);
});

it("should return error if dependency is disallowed", async () => {
	expect.assertions(1);
	pkg.dependencies = {
		eslint: "1.2.3",
	};
	const { content, ast } = generateAst(pkg);
	const results = await verifyPackageJson(pkg, ast, "package.json");
	expect(codeframe(content, results)).toMatchInlineSnapshot(`
		"ERROR: "eslint" should be a devDependency (disallowed-dependency) at package.json
		  18 |   },
		  19 |   "dependencies": {
		> 20 |     "eslint": "1.2.3"
		     |     ^
		  21 |   }
		  22 | }"
	`);
});

it("should return error if aliased dependency is disallowed", async () => {
	expect.assertions(1);
	pkg.dependencies = {
		aliased: "npm:eslint@1.2.3",
	};
	const { content, ast } = generateAst(pkg);
	const results = await verifyPackageJson(pkg, ast, "package.json");
	expect(codeframe(content, results)).toMatchInlineSnapshot(`
		"ERROR: "aliased" ("npm:eslint") should be a devDependency (disallowed-dependency) at package.json
		  18 |   },
		  19 |   "dependencies": {
		> 20 |     "aliased": "npm:eslint@1.2.3"
		     |     ^
		  21 |   }
		  22 | }"
	`);
});

it("should return error if dependency is obsolete", async () => {
	expect.assertions(1);
	pkg.devDependencies = {
		mkdirp: "1.2.3",
	};
	const { content, ast } = generateAst(pkg);
	const results = await verifyPackageJson(pkg, ast, "package.json");
	expect(codeframe(content, results)).toMatchInlineSnapshot(`
		"ERROR: "mkdirp" is obsolete and should no longer be used: use native "fs.mkdir(..., { recursive: true })" instead (obsolete-dependency) at package.json
		  18 |   },
		  19 |   "devDependencies": {
		> 20 |     "mkdirp": "1.2.3"
		     |     ^
		  21 |   }
		  22 | }"
	`);
});

it("should not return error if dependency is allowed", async () => {
	expect.assertions(1);
	pkg.dependencies = {
		allowed: "1.2.3",
	};
	const { ast } = generateAst(pkg);
	const results = await verifyPackageJson(pkg, ast, "package.json");
	expect(results).toEqual([]);
});

it("should not return error if explicitly allowed by user", async () => {
	expect.assertions(1);
	pkg.dependencies = {
		eslint: "1.2.3",
		aliased: "npm:eslint@1.2.3",
	};
	const { ast } = generateAst(pkg);
	const results = await verifyPackageJson(pkg, ast, "package.json", {
		allowedDependencies: new Set(["eslint"]),
		ignoreNodeVersion: false,
	});
	expect(results).toHaveLength(0);
});

it("should return engines.node supports eol version", async () => {
	expect.assertions(1);
	pkg.engines.node = ">= 8";
	const { content, ast } = generateAst(pkg);
	const results = await verifyPackageJson(pkg, ast, "package.json");
	expect(codeframe(content, results)).toMatchInlineSnapshot(`
		"ERROR: engines.node is satisfied by Node 8 (EOL since 2019-12-31) (outdated-engines) at package.json
		  15 |   },
		  16 |   "engines": {
		> 17 |     "node": ">= 8"
		     |             ^
		  18 |   }
		  19 | }"
	`);
});

describe("@types", () => {
	beforeEach(() => {
		pkg.dependencies = {
			"@types/foobar": "1.2.3",
		};
	});

	it("should return error if @types is used as dependency by default", async () => {
		expect.assertions(1);
		const { content, ast } = generateAst(pkg);
		const results = await verifyPackageJson(pkg, ast, "package.json");
		expect(codeframe(content, results)).toMatchInlineSnapshot(`
			"ERROR: "@types/foobar" should be a devDependency (disallowed-dependency) at package.json
			  18 |   },
			  19 |   "dependencies": {
			> 20 |     "@types/foobar": "1.2.3"
			     |     ^
			  21 |   }
			  22 | }"
		`);
	});

	it("should not return error if @types is allowed", async () => {
		expect.assertions(1);
		const { ast } = generateAst(pkg);
		const results = await verifyPackageJson(pkg, ast, "package.json", {
			allowedDependencies: new Set(),
			allowTypesDependencies: true,
			ignoreNodeVersion: false,
		});
		expect(results).toHaveLength(0);
	});
});

describe("present", () => {
	it("should return error on missing fields by default", async () => {
		expect.assertions(1);
		delete pkg.description;
		const { content, ast } = generateAst(pkg);
		const results = await verifyPackageJson(pkg, ast, "package.json");
		expect(codeframe(content, results)).toMatchInlineSnapshot(`
			"ERROR: "description" must be set (package-json-fields) at package.json
			> 1 | {
			    | ^
			  2 |   "name": "mock-pkg",
			  3 |   "version": "1.2.3",
			  4 |   "keywords": ["
		`);
	});

	it("should ignore error on missing fields if ignoreMissingFields is set", async () => {
		expect.assertions(1);
		delete pkg.description;
		const { ast } = generateAst(pkg);
		const results = await verifyPackageJson(pkg, ast, "package.json", {
			allowedDependencies: new Set(),
			ignoreMissingFields: true,
			ignoreNodeVersion: false,
		});
		expect(results).toHaveLength(0);
	});
});

describe("fields", () => {
	describe("description", () => {
		it("should return error if not set", async () => {
			expect.assertions(1);
			delete pkg.description;
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "description" must be set (package-json-fields) at package.json
				> 1 | {
				    | ^
				  2 |   "name": "mock-pkg",
				  3 |   "version": "1.2.3",
				  4 |   "keywords": ["
			`);
		});

		it("should return error if not string", async () => {
			expect.assertions(1);
			pkg.description = 12 as unknown as string;
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "description" must be string (package-json-fields) at package.json
				  2 |   "name": "mock-pkg",
				  3 |   "version": "1.2.3",
				> 4 |   "description": 12,
				    |                  ^
				  5 |   "keywords": [
				  6 |     "test"
				  7 |   ],"
			`);
		});

		it("should return error if empty", async () => {
			expect.assertions(1);
			pkg.description = "";
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "description" must not be empty (package-json-fields) at package.json
				  2 |   "name": "mock-pkg",
				  3 |   "version": "1.2.3",
				> 4 |   "description": "",
				    |                  ^
				  5 |   "keywords": [
				  6 |     "test"
				  7 |   ],"
			`);
		});
	});

	describe("keywords", () => {
		it("should return error if not set", async () => {
			expect.assertions(1);
			delete pkg.keywords;
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "keywords" must be set (package-json-fields) at package.json
				> 1 | {
				    | ^
				  2 |   "name": "mock-pkg",
				  3 |   "version": "1.2.3",
				  4 |   "description": "description","
			`);
		});

		it("should return error if not string", async () => {
			expect.assertions(1);
			pkg.keywords = 12 as unknown as string[];
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "keywords" must be array (package-json-fields) at package.json
				  3 |   "version": "1.2.3",
				  4 |   "description": "description",
				> 5 |   "keywords": 12,
				    |               ^
				  6 |   "homepage": "https://example.net",
				  7 |   "bugs": "https://example.net",
				  8 |   "license": "UNLICENSED","
			`);
		});

		it("should return error if empty", async () => {
			expect.assertions(1);
			pkg.keywords = [];
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "keywords" must not be empty (package-json-fields) at package.json
				  3 |   "version": "1.2.3",
				  4 |   "description": "description",
				> 5 |   "keywords": [],
				    |               ^
				  6 |   "homepage": "https://example.net",
				  7 |   "bugs": "https://example.net",
				  8 |   "license": "UNLICENSED","
			`);
		});

		it("should return error if items are empty", async () => {
			expect.assertions(1);
			pkg.keywords = [""];
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "keywords[0]" must not be empty (package-json-fields) at package.json
				  3 |   "version": "1.2.3",
				  4 |   "description": "description",
				> 5 |   "keywords": [
				    |               ^
				  6 |     ""
				  7 |   ],
				  8 |   "homepage": "https://example.net","
			`);
		});
	});

	describe("homepage", () => {
		it("should return error if not set", async () => {
			expect.assertions(1);
			delete pkg.homepage;
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "homepage" must be set (package-json-fields) at package.json
				> 1 | {
				    | ^
				  2 |   "name": "mock-pkg",
				  3 |   "version": "1.2.3",
				  4 |   "description": "description","
			`);
		});

		it("should return error if not string", async () => {
			expect.assertions(1);
			pkg.homepage = 12 as unknown as string;
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "homepage" must be string (package-json-fields) at package.json
				   6 |     "test"
				   7 |   ],
				>  8 |   "homepage": 12,
				     |               ^
				   9 |   "bugs": "https://example.net",
				  10 |   "license": "UNLICENSED",
				  11 |   "author": "Fred Flintstone <fred.flintstone@example.net>","
			`);
		});

		it("should return error if not valid url", async () => {
			expect.assertions(1);
			pkg.homepage = "foobar";
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "homepage" must be a valid url (https only) (package-json-fields) at package.json
				   6 |     "test"
				   7 |   ],
				>  8 |   "homepage": "foobar",
				     |               ^
				   9 |   "bugs": "https://example.net",
				  10 |   "license": "UNLICENSED",
				  11 |   "author": "Fred Flintstone <fred.flintstone@example.net>","
			`);
		});
	});

	describe("bugs", () => {
		it("should return error if not set", async () => {
			expect.assertions(1);
			delete pkg.bugs;
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "bugs" must be set (package-json-fields) at package.json
				> 1 | {
				    | ^
				  2 |   "name": "mock-pkg",
				  3 |   "version": "1.2.3",
				  4 |   "description": "description","
			`);
		});

		it("should return error if not valid url", async () => {
			expect.assertions(1);
			pkg.bugs = "foobar";
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "bugs" must be a valid url (https only) (package-json-fields) at package.json
				   7 |   ],
				   8 |   "homepage": "https://example.net",
				>  9 |   "bugs": "foobar",
				     |           ^
				  10 |   "license": "UNLICENSED",
				  11 |   "author": "Fred Flintstone <fred.flintstone@example.net>",
				  12 |   "repository": {"
			`);
		});
	});

	describe("license", () => {
		it("should return error if not set", async () => {
			expect.assertions(1);
			delete pkg.license;
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "license" must be set (package-json-fields) at package.json
				> 1 | {
				    | ^
				  2 |   "name": "mock-pkg",
				  3 |   "version": "1.2.3",
				  4 |   "description": "description","
			`);
		});

		it("should return error if not string", async () => {
			expect.assertions(1);
			pkg.license = 12 as unknown as string;
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "license" must be string (package-json-fields) at package.json
				   8 |   "homepage": "https://example.net",
				   9 |   "bugs": "https://example.net",
				> 10 |   "license": 12,
				     |              ^
				  11 |   "author": "Fred Flintstone <fred.flintstone@example.net>",
				  12 |   "repository": {
				  13 |     "type": "git","
			`);
		});

		it("should return error if empty", async () => {
			expect.assertions(1);
			pkg.license = "";
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "license" must not be empty (package-json-fields) at package.json
				   8 |   "homepage": "https://example.net",
				   9 |   "bugs": "https://example.net",
				> 10 |   "license": "",
				     |              ^
				  11 |   "author": "Fred Flintstone <fred.flintstone@example.net>",
				  12 |   "repository": {
				  13 |     "type": "git","
			`);
		});
	});

	describe("author", () => {
		it("should return error if not set", async () => {
			expect.assertions(1);
			delete pkg.author;
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "author" must be set (package-json-fields) at package.json
				> 1 | {
				    | ^
				  2 |   "name": "mock-pkg",
				  3 |   "version": "1.2.3",
				  4 |   "description": "description","
			`);
		});

		it("should return error if empty string", async () => {
			expect.assertions(1);
			pkg.author = "";
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "author" must not be empty (package-json-fields) at package.json
				   9 |   "bugs": "https://example.net",
				  10 |   "license": "UNLICENSED",
				> 11 |   "author": "",
				     |             ^
				  12 |   "repository": {
				  13 |     "type": "git",
				  14 |     "url": "git+https://git.example.net/test-case.git""
			`);
		});

		it("should return error if empty object", async () => {
			expect.assertions(1);
			pkg.author = {};
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "author" must not be empty (package-json-fields) at package.json
				   9 |   "bugs": "https://example.net",
				  10 |   "license": "UNLICENSED",
				> 11 |   "author": {},
				     |             ^
				  12 |   "repository": {
				  13 |     "type": "git",
				  14 |     "url": "git+https://git.example.net/test-case.git""
			`);
		});
	});

	describe("repository", () => {
		it("should return error if not set", async () => {
			expect.assertions(1);
			delete pkg.repository;
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "repository" must be set (package-json-fields) at package.json
				> 1 | {
				    | ^
				  2 |   "name": "mock-pkg",
				  3 |   "version": "1.2.3",
				  4 |   "description": "description","
			`);
		});

		it("should return error if not not an object", async () => {
			expect.assertions(1);
			pkg.repository = "foobar";
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "repository" must be an object with "type" and "url" (package-json-fields) at package.json
				  10 |   "license": "UNLICENSED",
				  11 |   "author": "Fred Flintstone <fred.flintstone@example.net>",
				> 12 |   "repository": "foobar",
				     |                 ^
				  13 |   "engines": {
				  14 |     "node": ">= 18"
				  15 |   }"
			`);
		});

		it("should return error if not valid url", async () => {
			expect.assertions(1);
			pkg.repository = { type: "git", url: "http://example.net" };
			const { content, ast } = generateAst(pkg);
			const results = await verifyPackageJson(pkg, ast, "package.json");
			expect(codeframe(content, results)).toMatchInlineSnapshot(`
				"ERROR: "repository.url" must use "git+https://" instead of "http://" (package-json-fields) at package.json
				  10 |   "license": "UNLICENSED",
				  11 |   "author": "Fred Flintstone <fred.flintstone@example.net>",
				> 12 |   "repository": {
				     |                 ^
				  13 |     "type": "git",
				  14 |     "url": "http://example.net"
				  15 |   },"
			`);
		});
	});
});
