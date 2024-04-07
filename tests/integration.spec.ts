jest.unmock("tar");

import { promises as fs } from "fs";
import * as path from "path";
import { globSync } from "glob";
import { execa } from "execa";
import { verify } from "../src/verify";
import { type PackageJson } from "../src/types";

const ROOT_DIRECTORY = path.resolve(path.join(__dirname, ".."));
const FIXTURE_DIRECTORY = path.join(__dirname, "fixtures");

const fixtures = globSync("*", { cwd: FIXTURE_DIRECTORY });

async function npmPack(pkg: PackageJson, fixture: string): Promise<string> {
	const dir = path.join(FIXTURE_DIRECTORY, fixture);
	const tarball = path.join(dir, `${pkg.name}-${pkg.version}.tgz`);
	await execa("npm", ["pack"], { cwd: dir });
	return path.relative(ROOT_DIRECTORY, tarball);
}

it.each(fixtures)("%s", async (fixture) => {
	expect.assertions(1);
	const dir = path.join(FIXTURE_DIRECTORY, fixture);
	const pkgPath = path.relative(ROOT_DIRECTORY, path.join(dir, "package.json"));
	const pkg: PackageJson = JSON.parse(await fs.readFile(pkgPath, "utf-8"));
	const tarball = { filePath: await npmPack(pkg, fixture) };
	const result = await verify(pkg, pkgPath, tarball, { allowedDependencies: new Set() });
	expect(result).toMatchSnapshot();
});
