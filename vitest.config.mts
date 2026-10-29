import { defineTestConfig } from "@html-validate/vitest-config";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: defineTestConfig({
		coverage: {
			enabled: true,
		},
		exclude: ["**/dist/**", "**/fixtures/**", "**/node_modules/**", "**/temp/**"],
	}),
});
