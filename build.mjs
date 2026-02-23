import * as esbuild from "esbuild";

const cjsCompat = `
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
`;

const result = await esbuild.build({
	entryPoints: ["src/index.ts"],
	outdir: "dist",
	sourcemap: true,
	bundle: true,
	platform: "node",
	target: "node20",
	format: "esm",
	banner: {
		js: cjsCompat,
	},
	metafile: true,
	logLevel: "info",
});
console.log(await esbuild.analyzeMetafile(result.metafile));
