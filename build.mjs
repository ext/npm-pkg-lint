import fs from "node:fs/promises";
import { generateDtsBundle } from "dts-bundle-generator";
import * as esbuild from "esbuild";

const cjsCompat = `
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
`;

const result = await esbuild.build({
	entryPoints: ["src/index.ts", { in: "src/config/index.ts", out: "config" }],
	outdir: "dist",
	sourcemap: true,
	bundle: true,
	platform: "node",
	target: "node22",
	format: "esm",
	banner: {
		js: cjsCompat,
	},
	metafile: true,
	logLevel: "info",
});
console.log(await esbuild.analyzeMetafile(result.metafile));

const [configDts] = generateDtsBundle([
	{ filePath: "src/config/index.ts", output: { noBanner: true } },
]);
await fs.writeFile("dist/config.d.ts", configDts);
