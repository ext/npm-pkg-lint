/* istanbul ignore file -- IDE helper only */

import { type UserConfig } from "./types";

/**
 * Helper providing type checking and autocompletion for the configuration file.
 *
 * @public
 */
export function defineConfig(config: UserConfig): UserConfig {
	return config;
}
