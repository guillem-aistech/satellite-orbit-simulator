// App entry point - sets up React with TanStack Router and Query

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen.ts"; // Auto-generated from routes/ folder
import "./styles/tokens.css"; // Design tokens (colors, spacing, etc.)

const queryClient = new QueryClient();

const router = createRouter({
	routeTree,
	context: { queryClient },
	defaultPreload: "intent", // Preload routes on hover
});

// TypeScript: register router type for type-safe navigation
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Mount React app to #root element in index.html
const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</StrictMode>,
	);
}
