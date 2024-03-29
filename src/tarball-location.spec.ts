import { tarballLocation } from "./tarball-location";
import { PackageJson } from "./types";

it("should generate tarball filename based on package.json name and version", () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "mock-package",
		version: "1.2.3",
	};
	expect(tarballLocation(pkg, "./package.json")).toBe("mock-package-1.2.3.tgz");
});

it("should handle scoped packages", () => {
	expect.assertions(1);
	const pkg: PackageJson = {
		name: "@org/mock-package",
		version: "1.2.3",
	};
	expect(tarballLocation(pkg, "./package.json")).toBe("org-mock-package-1.2.3.tgz");
});
