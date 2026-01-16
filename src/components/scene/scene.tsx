import { useAtomValue } from "@effect-atom/atom-react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { ComponentRef, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { selectedAxesAtom } from "../../atoms/camera.ts";
import { EARTH_RADIUS, SUN_DISTANCE } from "../../physics/index.ts";

interface SceneProps {
	children: ReactNode;
}

const DEFAULT_CAMERA_POSITION: [number, number, number] = [-4, 4, 6];

// OrbitControls properties needed for axis locking
interface OrbitControlsLike {
	minAzimuthAngle: number;
	maxAzimuthAngle: number;
	minPolarAngle: number;
	maxPolarAngle: number;
	getAzimuthalAngle: () => number;
	getPolarAngle: () => number;
}

// Camera controls that can lock rotation to selected axes (X, Y, Z)
// Y = horizontal rotation, X/Z = vertical rotation
function ConstrainedOrbitControls() {
	const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
	const selectedAxes = useAtomValue(selectedAxesAtom);

	// Store angles when constraints are applied
	const lockedAnglesRef = useRef<{ azimuth: number; polar: number } | null>(null);

	useEffect(() => {
		if (!controlsRef.current) return;

		const controls = controlsRef.current as OrbitControlsLike;
		const hasSelection = selectedAxes.length > 0;
		const allSelected = selectedAxes.length === 3;

		// Free rotation if no axes selected or all axes selected
		if (!hasSelection || allSelected) {
			controls.minAzimuthAngle = -Infinity;
			controls.maxAzimuthAngle = Infinity;
			controls.minPolarAngle = 0.1;
			controls.maxPolarAngle = Math.PI - 0.1;
			lockedAnglesRef.current = null;
			return;
		}

		// Get current angles if not locked yet
		if (!lockedAnglesRef.current) {
			lockedAnglesRef.current = {
				azimuth: controls.getAzimuthalAngle(),
				polar: controls.getPolarAngle(),
			};
		}

		const { azimuth, polar } = lockedAnglesRef.current;

		// Y axis = horizontal rotation (azimuth)
		// X/Z axes = vertical rotation (polar)
		const canRotateHorizontal = selectedAxes.includes("y");
		const canRotateVertical = selectedAxes.includes("x") || selectedAxes.includes("z");

		if (canRotateHorizontal) {
			controls.minAzimuthAngle = -Infinity;
			controls.maxAzimuthAngle = Infinity;
		} else {
			// Lock horizontal rotation
			controls.minAzimuthAngle = azimuth;
			controls.maxAzimuthAngle = azimuth;
		}

		if (canRotateVertical) {
			controls.minPolarAngle = 0.1;
			controls.maxPolarAngle = Math.PI - 0.1;
		} else {
			// Lock vertical rotation
			controls.minPolarAngle = polar;
			controls.maxPolarAngle = polar;
		}
	}, [selectedAxes]);

	// Reset locked angles when selection changes
	useEffect(() => {
		lockedAnglesRef.current = null;
	}, []);

	return (
		<OrbitControls
			ref={controlsRef}
			makeDefault
			minDistance={EARTH_RADIUS * 1.5}
			maxDistance={SUN_DISTANCE * 2}
			enablePan={true}
			enableZoom={true}
			enableRotate={true}
		/>
	);
}

// Main 3D canvas - children render inside 3D context (Earth, Satellite, etc.)
export function Scene({ children }: SceneProps) {
	return (
		// Canvas creates WebGL context; shadows enables shadow mapping
		<Canvas
			shadows
			camera={{
				position: DEFAULT_CAMERA_POSITION,
				fov: 60,
				far: 100,
			}}
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				background: "#0A0A14",
			}}
		>
			{children}
			<ConstrainedOrbitControls />
		</Canvas>
	);
}
