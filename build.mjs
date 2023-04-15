import * as esbuild from "esbuild";

const cjsCompat = `
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
`;

async function run() {
	const result = await esbuild.build({
		entryPoints: ["src/index.ts"],
		outdir: "dist",
		sourcemap: true,
		bundle: true,
		platform: "node",
		target: "node14",
		format: "esm",
		banner: {
			js: cjsCompat,
		},
		metafile: true,
		logLevel: "info",
	});
	console.log(await esbuild.analyzeMetafile(result.metafile));
}

run().catch((err) => {
	console.error(err);
	process.exitCode = 1;
});
