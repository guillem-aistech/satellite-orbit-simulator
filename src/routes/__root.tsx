// Root layout - wraps all routes with providers

import { RegistryProvider } from "@effect-atom/atom-react";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	return (
		// RegistryProvider: enables Effect Atoms state management
		// Outlet: renders the matched child route (e.g., index.tsx)
		<RegistryProvider>
			<Outlet />
		</RegistryProvider>
	);
}
