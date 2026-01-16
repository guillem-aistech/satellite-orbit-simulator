/**
 * 8U Nanosatellite Component
 *
 * Represents an 8U CubeSat (2U × 2U × 2U configuration).
 * Real dimensions: 20cm × 20cm × 20cm (cube)
 * Scene dimensions: Scaled up for visibility
 *
 * Structure:
 * - Main body: Cubic bus housing electronics
 * - Solar panels: Deployed outward from top edges (wing style)
 * - Thermal imaging payload: Bottom-facing sensor
 */

import { useAtom, useAtomValue } from "@effect-atom/atom-react";
import { useEffect, useMemo } from "react";
import { pitchAtom, rollAtom, satellitePositionAtom, yawAtom } from "../../atoms/satellite.ts";
import { orbitalAngleAtom, orbitTypeAtom } from "../../atoms/simulation.ts";
import { calculateOrbitalPosition, getOrbitById } from "../../physics/index.ts";

// Light colors for visibility against dark space background
const BODY_COLOR = "#E8E8E8"; // Light gray body
const PANEL_COLOR = "#7CB9E8"; // Light sky blue for solar panels
const PANEL_CELL_COLOR = "#4A90D9"; // Slightly darker blue for panel cells
const SENSOR_COLOR = "#FFD700"; // Gold for thermal sensor (visible accent)

/**
 * 8U CubeSat dimensions (scaled for demo visibility)
 * Real 8U: 2U × 2U × 2U = 20cm × 20cm × 20cm (cube)
 * 1U = 10cm, so 2U = 20cm per side
 */
const SCALE = 0.05; // Base scale factor
const BODY = {
	width: 2 * SCALE, // X: 2U (20cm)
	height: 2 * SCALE, // Y: 2U (20cm)
	depth: 2 * SCALE, // Z: 2U (20cm) - cubic shape
};

/**
 * Solar panel dimensions
 * Two panels deploy from top, opening outward like wings
 * Each panel extends horizontally from the top edges
 */
const PANEL = {
	width: 4 * SCALE, // Panel length (extends outward in X)
	height: 0.05 * SCALE, // Panel thickness
	depth: 2.5 * SCALE, // Panel depth (along Z)
};

// Panel deployment: open outward from top edges
const PANEL_Y = BODY.height / 2; // At top of body
const PANEL_OFFSET_X = BODY.width / 2 + PANEL.width / 2; // Extend outward from body edge

export function Satellite() {
	const orbitalAngle = useAtomValue(orbitalAngleAtom);
	const orbitTypeId = useAtomValue(orbitTypeAtom);
	const roll = useAtomValue(rollAtom);
	const pitch = useAtomValue(pitchAtom);
	const yaw = useAtomValue(yawAtom);
	const [, setSatellitePosition] = useAtom(satellitePositionAtom);

	const selectedOrbit = getOrbitById(orbitTypeId);

	const position = useMemo(
		() => calculateOrbitalPosition(orbitalAngle, selectedOrbit),
		[orbitalAngle, selectedOrbit],
	);

	// Update satellite position atom for camera tracking
	useEffect(() => {
		setSatellitePosition(position);
	}, [position, setSatellitePosition]);

	return (
		// group: container for all satellite parts, positioned in orbit with attitude rotation
		<group position={position} rotation={[roll, pitch, yaw]}>
			{/* Main body - 8U CubeSat bus */}
			<mesh castShadow>
				<boxGeometry args={[BODY.width, BODY.height, BODY.depth]} />
				<meshStandardMaterial color={BODY_COLOR} />
			</mesh>

			{/* Body accent stripe (visual detail) */}
			<mesh position={[0, 0, BODY.depth * 0.35]}>
				<boxGeometry args={[BODY.width + 0.001, BODY.height + 0.001, BODY.depth * 0.15]} />
				<meshStandardMaterial color="#CCCCCC" />
			</mesh>

			{/* Left solar panel - deployed outward (wing style) */}
			<group position={[-PANEL_OFFSET_X, PANEL_Y, 0]}>
				{/* Panel frame */}
				<mesh castShadow>
					<boxGeometry args={[PANEL.width, PANEL.height, PANEL.depth]} />
					<meshStandardMaterial color={PANEL_COLOR} />
				</mesh>
				{/* Panel cells (darker inset on top) */}
				<mesh position={[0, PANEL.height * 0.6, 0]}>
					<boxGeometry args={[PANEL.width * 0.9, PANEL.height * 0.3, PANEL.depth * 0.9]} />
					<meshStandardMaterial color={PANEL_CELL_COLOR} />
				</mesh>
			</group>

			{/* Right solar panel - deployed outward (wing style) */}
			<group position={[PANEL_OFFSET_X, PANEL_Y, 0]}>
				{/* Panel frame */}
				<mesh castShadow>
					<boxGeometry args={[PANEL.width, PANEL.height, PANEL.depth]} />
					<meshStandardMaterial color={PANEL_COLOR} />
				</mesh>
				{/* Panel cells (darker inset on top) */}
				<mesh position={[0, PANEL.height * 0.6, 0]}>
					<boxGeometry args={[PANEL.width * 0.9, PANEL.height * 0.3, PANEL.depth * 0.9]} />
					<meshStandardMaterial color={PANEL_CELL_COLOR} />
				</mesh>
			</group>

			{/* Panel hinges at body edges */}
			<mesh position={[-BODY.width / 2, PANEL_Y, 0]}>
				<boxGeometry args={[SCALE * 0.2, SCALE * 0.15, PANEL.depth * 0.4]} />
				<meshStandardMaterial color="#AAAAAA" />
			</mesh>
			<mesh position={[BODY.width / 2, PANEL_Y, 0]}>
				<boxGeometry args={[SCALE * 0.2, SCALE * 0.15, PANEL.depth * 0.4]} />
				<meshStandardMaterial color="#AAAAAA" />
			</mesh>

			{/* Thermal imaging sensor - bottom facing (nadir) */}
			<mesh position={[0, -BODY.height / 2 - SCALE * 0.15, BODY.depth * 0.2]}>
				<cylinderGeometry args={[SCALE * 0.4, SCALE * 0.5, SCALE * 0.3, 16]} />
				<meshStandardMaterial color={SENSOR_COLOR} />
			</mesh>

			{/* Sensor aperture */}
			<mesh position={[0, -BODY.height / 2 - SCALE * 0.32, BODY.depth * 0.2]}>
				<cylinderGeometry args={[SCALE * 0.25, SCALE * 0.25, SCALE * 0.05, 16]} />
				<meshStandardMaterial color="#333333" />
			</mesh>
		</group>
	);
}
