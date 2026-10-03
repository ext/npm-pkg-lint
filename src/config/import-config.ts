/* istanbul ignore file -- jest helper, jest does not support import() so we mock this file */

import { pathToFileURL } from "node:url";

/**
 * Isolated so tests can mock it (dynamic `import()` is not available when jest
 * transpiles to commonjs).
 */
export async function importConfig(filePath: string): Promise<unknown> {
	const mod = (await import(pathToFileURL(filePath).href)) as { default?: unknown };
	return mod.default;
}
