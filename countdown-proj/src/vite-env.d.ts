/// <reference types="vite/client" />
import { UserConfig } from "vite";

const config: UserConfig = {
	// Other configuration options...
	exclude: [
		// Exclude specific files or directories using glob patterns
		// "src/components/**/*.test.ts",
		"public/video.mp4",
	],
};

export default config;
