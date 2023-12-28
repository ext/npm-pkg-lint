import { validRepoUrl } from "./valid-repo-url";

const key = "repository";

it("should not throw error on valid url (without directory)", () => {
	expect.assertions(1);
	const repository = { type: "git", url: "git+https://example.net/foo/bar" };
	expect(() => validRepoUrl(key, repository)).not.toThrow();
});

it("should not throw error on valid url (with directory)", () => {
	expect.assertions(1);
	const repository = {
		type: "git",
		url: "git+https://example.net/foo/bar",
		directory: "packages/foo-bar",
	};
	expect(() => validRepoUrl(key, repository)).not.toThrow();
});

it("should not throw error if field is unset", () => {
	expect.assertions(1);
	const repository = undefined;
	expect(() => validRepoUrl(key, repository)).not.toThrow();
});

it("should throw error field is null", () => {
	expect.assertions(1);
	const repository = "git+https://example.net/foo/bar";
	expect(() => validRepoUrl(key, repository)).toThrowErrorMatchingInlineSnapshot(
		`""repository" must be an object with "type" and "url""`,
	);
});

it("should throw error field is not object", () => {
	expect.assertions(1);
	const repository = "git+https://example.net/foo/bar";
	expect(() => validRepoUrl(key, repository)).toThrowErrorMatchingInlineSnapshot(
		`""repository" must be an object with "type" and "url""`,
	);
});

it("should throw error if type is missing", () => {
	expect.assertions(1);
	const repository = { url: "git+https://example.net/foo/bar" };
	expect(() => validRepoUrl(key, repository)).toThrowErrorMatchingInlineSnapshot(
		`""repository" is missing required "type" property"`,
	);
});

it("should throw error if type is not a string", () => {
	expect.assertions(1);
	const repository = { type: 12, url: "git+https://example.net/foo/bar" };
	expect(() => validRepoUrl(key, repository)).toThrowErrorMatchingInlineSnapshot(
		`""repository.type" must be a string"`,
	);
});

it("should throw error if type is not a git", () => {
	expect.assertions(1);
	const repository = { type: "svn", url: "git+https://example.net/foo/bar" };
	expect(() => validRepoUrl(key, repository)).toThrowErrorMatchingInlineSnapshot(
		`""repository.type" must be "git""`,
	);
});

it("should throw error if url is missing", () => {
	expect.assertions(1);
	const repository = { type: "git" };
	expect(() => validRepoUrl(key, repository)).toThrowErrorMatchingInlineSnapshot(
		`""repository" is missing required "url" property"`,
	);
});

it("should throw error if url is not a string", () => {
	expect.assertions(1);
	const repository = { type: "git", url: 12 };
	expect(() => validRepoUrl(key, repository)).toThrowErrorMatchingInlineSnapshot(
		`""repository.url" must be a string"`,
	);
});

it("should throw error if url is empty string", () => {
	expect.assertions(1);
	const repository = { type: "git", url: "" };
	expect(() => validRepoUrl(key, repository)).toThrowErrorMatchingInlineSnapshot(
		`""repository.url" must not be empty"`,
	);
});

it("should throw error if url has leading or trailing whitespace", () => {
	expect.assertions(1);
	const repository = { type: "git", url: " x " };
	expect(() => validRepoUrl(key, repository)).toThrowErrorMatchingInlineSnapshot(
		`""repository.url" must not have leading or trailing whitespace"`,
	);
});

it("should throw error if url is missing hostname", () => {
	expect.assertions(1);
	const repository = { type: "git", url: "git+https://" };
	expect(() => validRepoUrl(key, repository)).toThrowErrorMatchingInlineSnapshot(
		`""repository.url" be a valid url"`,
	);
});

it("should throw error if url is http (with git+ prefix)", () => {
	expect.assertions(1);
	const repository = { type: "git", url: "git+http://example.net/foo/bar" };
	expect(() => validRepoUrl(key, repository)).toThrowErrorMatchingInlineSnapshot(
		`""repository.url" must use "git+https://" instead of "http://""`,
	);
});

it("should throw error if url is http (without git+ prefix)", () => {
	expect.assertions(1);
	const repository = { type: "git", url: "http://example.net/foo/bar" };
	expect(() => validRepoUrl(key, repository)).toThrowErrorMatchingInlineSnapshot(
		`""repository.url" must use "git+https://" instead of "http://""`,
	);
});

it("should throw error if url is missing git+ prefix", () => {
	expect.assertions(1);
	const repository = { type: "git", url: "https://example.net/foo/bar" };
	expect(() => validRepoUrl(key, repository)).toThrowErrorMatchingInlineSnapshot(
		`""repository.url" must use "git+https://" protocol"`,
	);
});

it("should throw error if directory is not a string", () => {
	expect.assertions(1);
	const repository = {
		type: "git",
		url: "git+https://example.net/foo/bar",
		directory: 12,
	};
	expect(() => validRepoUrl(key, repository)).toThrowErrorMatchingInlineSnapshot(
		`""repository.directory" must be a string"`,
	);
});

it("should throw error if directory is empty string", () => {
	expect.assertions(1);
	const repository = {
		type: "git",
		url: "git+https://example.net/foo/bar",
		directory: "",
	};
	expect(() => validRepoUrl(key, repository)).toThrowErrorMatchingInlineSnapshot(
		`""repository.directory" must be set to non-empty string or the property must be removed"`,
	);
});
