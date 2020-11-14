import { verifyPackageJson } from "./package-json";
import PackageJson from "./types/package-json";

let pkg: PackageJson;

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
		repository: "https://git.example.net/test-case.git",
	};
});

it("should not return errors if package.json is well formed (strings only)", async () => {
	expect.assertions(1);
	const result = await verifyPackageJson(pkg, "package.json");
	expect(result.messages).toEqual([]);
});

describe("description", () => {
	it("should return error if not set", async () => {
		expect.assertions(1);
		delete pkg.description;
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});

	it("should return error if not string", async () => {
		expect.assertions(1);
		pkg.description = (12 as unknown) as string;
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});

	it("should return error if empty", async () => {
		expect.assertions(1);
		pkg.description = "";
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});
});

describe("keywords", () => {
	it("should return error if not set", async () => {
		expect.assertions(1);
		delete pkg.keywords;
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});

	it("should return error if not string", async () => {
		expect.assertions(1);
		pkg.keywords = (12 as unknown) as string[];
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});

	it("should return error if empty", async () => {
		expect.assertions(1);
		pkg.keywords = [];
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});

	it("should return error if items are empty", async () => {
		expect.assertions(1);
		pkg.keywords = [""];
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});
});

describe("homepage", () => {
	it("should return error if not set", async () => {
		expect.assertions(1);
		delete pkg.homepage;
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});

	it("should return error if not string", async () => {
		expect.assertions(1);
		pkg.homepage = (12 as unknown) as string;
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});

	it("should return error if not valid url", async () => {
		expect.assertions(1);
		pkg.homepage = "foobar";
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});
});

describe("bugs", () => {
	it("should return error if not set", async () => {
		expect.assertions(1);
		delete pkg.bugs;
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});

	it("should return error if not valid url", async () => {
		expect.assertions(1);
		pkg.bugs = "foobar";
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});
});

describe("license", () => {
	it("should return error if not set", async () => {
		expect.assertions(1);
		delete pkg.license;
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});

	it("should return error if not string", async () => {
		expect.assertions(1);
		pkg.license = (12 as unknown) as string;
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});

	it("should return error if empty", async () => {
		expect.assertions(1);
		pkg.license = "";
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});
});

describe("author", () => {
	it("should return error if not set", async () => {
		expect.assertions(1);
		delete pkg.author;
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});

	it("should return error if empty string", async () => {
		expect.assertions(1);
		pkg.author = "";
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});

	it("should return error if empty object", async () => {
		expect.assertions(1);
		pkg.author = {};
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});
});

describe("repository", () => {
	it("should return error if not set", async () => {
		expect.assertions(1);
		delete pkg.repository;
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});

	it("should return error if not valid url", async () => {
		expect.assertions(1);
		pkg.repository = "foobar";
		const result = await verifyPackageJson(pkg, "package.json");
		expect(result.messages).toMatchSnapshot();
	});
});
