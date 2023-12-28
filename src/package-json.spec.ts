import { verifyPackageJson } from "./package-json";
import { PackageJson } from "./types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- it exists in the mock only
// @ts-expect-error
import { npmInfoMockDefault } from "./utils/npm-info";

jest.mock("./utils/npm-info");

let pkg: PackageJson & Required<Pick<PackageJson, "engines">>;

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
	const results = await verifyPackageJson(pkg, "package.json");
	expect(results).toEqual([]);
});

it("should not return errors if package.json has no dependencies", async () => {
	expect.assertions(1);
	delete pkg.dependencies;
	const results = await verifyPackageJson(pkg, "package.json");
	expect(results).toEqual([]);
});

it("should return error if dependency is disallowed", async () => {
	expect.assertions(3);
	pkg.dependencies = {
		eslint: "1.2.3",
	};
	const results = await verifyPackageJson(pkg, "package.json");
	expect(results).toHaveLength(1);
	expect(results[0].filePath).toBe("package.json");
	expect(results[0].messages).toMatchSnapshot();
});

it("should return error if dependency is obsolete", async () => {
	expect.assertions(3);
	pkg.devDependencies = {
		mkdirp: "1.2.3",
	};
	const results = await verifyPackageJson(pkg, "package.json");
	expect(results).toHaveLength(1);
	expect(results[0].filePath).toBe("package.json");
	expect(results[0].messages).toMatchInlineSnapshot(`
		[
		  {
		    "column": 1,
		    "line": 1,
		    "message": "mkdirp is obsolete and should no longer be used: use native "fs.mkdir(..., { recursive: true })" instead",
		    "ruleId": "obsolete-dependency",
		    "severity": 2,
		  },
		]
	`);
});

it("should not return error if dependency is allowed", async () => {
	expect.assertions(1);
	pkg.dependencies = {
		allowed: "1.2.3",
	};
	const results = await verifyPackageJson(pkg, "package.json");
	expect(results).toEqual([]);
});

it("should return engines.node supports eol version", async () => {
	expect.assertions(3);
	pkg.engines.node = ">= 8";
	const results = await verifyPackageJson(pkg, "package.json");
	expect(results).toHaveLength(1);
	expect(results[0].filePath).toBe("package.json");
	expect(results[0].messages).toMatchSnapshot();
});

describe("@types", () => {
	beforeEach(() => {
		pkg.dependencies = {
			"@types/foobar": "1.2.3",
		};
	});

	it("should return error if @types is used as dependency by default", async () => {
		expect.assertions(1);
		const results = await verifyPackageJson(pkg, "package.json");
		expect(results).toHaveLength(1);
	});

	it("should not return error if @types is allowed", async () => {
		expect.assertions(1);
		const results = await verifyPackageJson(pkg, "package.json", { allowTypesDependencies: true });
		expect(results).toHaveLength(0);
	});
});

describe("present", () => {
	it("should return error on missing fields by default", async () => {
		expect.assertions(1);
		delete pkg.description;
		const results = await verifyPackageJson(pkg, "package.json");
		expect(results).toHaveLength(1);
	});

	it("should ignore error on missing fields if ignoreMissingFields is set", async () => {
		expect.assertions(1);
		delete pkg.description;
		const results = await verifyPackageJson(pkg, "package.json", { ignoreMissingFields: true });
		expect(results).toHaveLength(0);
	});
});

describe("fields", () => {
	describe("description", () => {
		it("should return error if not set", async () => {
			expect.assertions(3);
			delete pkg.description;
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});

		it("should return error if not string", async () => {
			expect.assertions(3);
			pkg.description = 12 as unknown as string;
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});

		it("should return error if empty", async () => {
			expect.assertions(3);
			pkg.description = "";
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});
	});

	describe("keywords", () => {
		it("should return error if not set", async () => {
			expect.assertions(3);
			delete pkg.keywords;
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});

		it("should return error if not string", async () => {
			expect.assertions(3);
			pkg.keywords = 12 as unknown as string[];
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});

		it("should return error if empty", async () => {
			expect.assertions(3);
			pkg.keywords = [];
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});

		it("should return error if items are empty", async () => {
			expect.assertions(3);
			pkg.keywords = [""];
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});
	});

	describe("homepage", () => {
		it("should return error if not set", async () => {
			expect.assertions(3);
			delete pkg.homepage;
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});

		it("should return error if not string", async () => {
			expect.assertions(3);
			pkg.homepage = 12 as unknown as string;
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});

		it("should return error if not valid url", async () => {
			expect.assertions(3);
			pkg.homepage = "foobar";
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});
	});

	describe("bugs", () => {
		it("should return error if not set", async () => {
			expect.assertions(3);
			delete pkg.bugs;
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});

		it("should return error if not valid url", async () => {
			expect.assertions(3);
			pkg.bugs = "foobar";
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});
	});

	describe("license", () => {
		it("should return error if not set", async () => {
			expect.assertions(3);
			delete pkg.license;
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});

		it("should return error if not string", async () => {
			expect.assertions(3);
			pkg.license = 12 as unknown as string;
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});

		it("should return error if empty", async () => {
			expect.assertions(3);
			pkg.license = "";
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});
	});

	describe("author", () => {
		it("should return error if not set", async () => {
			expect.assertions(3);
			delete pkg.author;
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});

		it("should return error if empty string", async () => {
			expect.assertions(3);
			pkg.author = "";
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});

		it("should return error if empty object", async () => {
			expect.assertions(3);
			pkg.author = {};
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchSnapshot();
		});
	});

	describe("repository", () => {
		it("should return error if not set", async () => {
			expect.assertions(3);
			delete pkg.repository;
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchInlineSnapshot(`
				[
				  {
				    "column": 1,
				    "line": 1,
				    "message": ""repository" must be set",
				    "ruleId": "package-json-fields",
				    "severity": 2,
				  },
				]
			`);
		});

		it("should return error if not not an object", async () => {
			expect.assertions(3);
			pkg.repository = "foobar";
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchInlineSnapshot(`
				[
				  {
				    "column": 1,
				    "line": 1,
				    "message": ""repository" must be an object with "type" and "url"",
				    "ruleId": "package-json-fields",
				    "severity": 2,
				  },
				]
			`);
		});

		it("should return error if not valid url", async () => {
			expect.assertions(3);
			pkg.repository = { type: "git", url: "http://example.net" };
			const results = await verifyPackageJson(pkg, "package.json");
			expect(results).toHaveLength(1);
			expect(results[0].filePath).toBe("package.json");
			expect(results[0].messages).toMatchInlineSnapshot(`
				[
				  {
				    "column": 1,
				    "line": 1,
				    "message": ""repository.url" must use "git+https://" instead of "http://"",
				    "ruleId": "package-json-fields",
				    "severity": 2,
				  },
				]
			`);
		});
	});
});
