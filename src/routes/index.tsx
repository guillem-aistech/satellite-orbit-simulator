// Home page - main simulation view

import { createFileRoute } from "@tanstack/react-router";
import { AnimationController } from "../components/scene/animation_controller.tsx";
import { Earth } from "../components/scene/earth.tsx";
import { Lighting } from "../components/scene/lighting.tsx";
import { OrbitPath } from "../components/scene/orbit_path.tsx";
import { Satellite } from "../components/scene/satellite.tsx";
import { Scene } from "../components/scene/scene.tsx";
import { MainCameraCapture, SceneToolbar } from "../components/scene/scene_toolbar.tsx";
import { Stars } from "../components/scene/stars.tsx";
import { Sun } from "../components/scene/sun.tsx";
import { ControlPanel } from "../components/ui/control_panel.tsx";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		// Full-screen layout: 3D scene on top, control panel at bottom
		<div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
			{/* 3D scene container - takes remaining space */}
			<div style={{ flex: 1, position: "relative", minHeight: 0 }}>
				<Scene>
					{/* Invisible components (state/capture) */}
					<MainCameraCapture />
					<AnimationController />

					{/* Background */}
					<Stars />
					<Lighting />
					<Sun />

					{/* Main objects */}
					<Earth />
					<Satellite />
					<OrbitPath />

					{/* UI overlay in 3D space */}
					<SceneToolbar />
				</Scene>
			</div>

			{/* Control panel - fixed at bottom */}
			<ControlPanel />
		</div>
	);
}
