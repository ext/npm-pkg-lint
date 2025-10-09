jest.unmock("tar");

import { promises as fs } from "node:fs";
import * as path from "node:path";
import { parse } from "@humanwhocodes/momoa";
import { globSync } from "glob";
import spawn from "nano-spawn";
import { type PackageJson } from "../src/types";
import { codeframe } from "../src/utils/codeframe";
import { verify } from "../src/verify";

const ROOT_DIRECTORY = path.resolve(path.join(__dirname, ".."));
const FIXTURE_DIRECTORY = path.join(__dirname, "fixtures");

const fixtures = globSync("*", { cwd: FIXTURE_DIRECTORY });

async function npmPack(pkg: PackageJson, fixture: string): Promise<string> {
	const dir = path.join(FIXTURE_DIRECTORY, fixture);
	const tarball = path.join(dir, `${pkg.name}-${pkg.version}.tgz`);
	await spawn("npm", ["pack"], { cwd: dir });
	return path.relative(ROOT_DIRECTORY, tarball);
}

it.each(fixtures)("%s", async (fixture) => {
	expect.assertions(1);
	const dir = path.join(FIXTURE_DIRECTORY, fixture);
	const pkgPath = path.relative(ROOT_DIRECTORY, path.join(dir, "package.json"));
	const content = await fs.readFile(pkgPath, "utf-8");
	const pkgAst = parse(content);
	const pkg: PackageJson = JSON.parse(content);
	const tarball = { filePath: await npmPack(pkg, fixture) };
	const result = await verify(pkg, pkgAst, pkgPath, tarball, {
		allowedDependencies: new Set(),
		ignoreNodeVersion: false,
	});
	expect(codeframe(content, result)).toMatchSnapshot();
});
