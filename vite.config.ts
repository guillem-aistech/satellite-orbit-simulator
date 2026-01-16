import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [TanStackRouterVite({ autoCodeSplitting: true }), react()],
	server: {
		port: 4000,
		fs: {
			allow: [".", "src", "node_modules"],
		},
	},
	optimizeDeps: {
		exclude: ["opensrc"],
	},
});
