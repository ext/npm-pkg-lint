jest.unmock("tar");

import { promises as fs } from "fs";
import path from "path";
import glob from "glob";
import execa from "execa";
import { verifyTarball } from "../src/tarball";
import PackageJson from "../src/types/package-json";

const ROOT_DIRECTORY = path.resolve(path.join(__dirname, ".."));
const FIXTURE_DIRECTORY = path.join(__dirname, "fixtures");

const fixtures = glob.sync(path.join(FIXTURE_DIRECTORY, "*")).map((fixture: string) => {
	return path.relative(FIXTURE_DIRECTORY, fixture);
});

async function npmPack(pkg: PackageJson, fixture: string): Promise<string> {
	const dir = path.join(FIXTURE_DIRECTORY, fixture);
	const tarball = path.join(dir, `${pkg.name}-${pkg.version}.tgz`);
	await execa("npm", ["pack"], { cwd: dir });
	return path.relative(ROOT_DIRECTORY, tarball);
}

it.each(fixtures)("%s", async (fixture) => {
	expect.assertions(1);
	const dir = path.join(FIXTURE_DIRECTORY, fixture);
	const pkg: PackageJson = JSON.parse(await fs.readFile(path.join(dir, "package.json"), "utf-8"));
	const tarball = await npmPack(pkg, fixture);
	const result = await verifyTarball(pkg, tarball);
	expect(result).toMatchSnapshot();
});
