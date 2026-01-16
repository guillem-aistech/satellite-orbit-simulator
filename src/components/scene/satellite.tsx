/**
 * 8U Nanosatellite Component
 *
 * Represents an 8U CubeSat (1U × 2U × 4U configuration).
 * Real dimensions: 10cm × 20cm × 40cm (tall rectangular)
 * Scene dimensions: Scaled up for visibility
 *
 * Layout (front view, looking at 4U×2U face):
 *           ┌───◯───┐       ← top with telescope hole
 *           │       │
 *           │       │       ← body (4U tall × 2U deep)
 *           │       │
 *           └───────┘
 *      ═════         ═════  ← solar panels extending left/right (±X)
 *
 * Structure:
 * - Main body: Tall rectangular bus (1U × 2U × 4U) - X × Z × Y
 * - Solar panels: Deployed from bottom face, extending in ±X direction
 *                 Width matches body depth (2U) to shade the large face
 * - Telescope: Hole on top face (inside top cube)
 */

import { useAtom, useAtomValue } from "@effect-atom/atom-react";
import { useEffect, useMemo } from "react";
import { pitchAtom, rollAtom, satellitePositionAtom, yawAtom } from "../../atoms/satellite.ts";
import { orbitalAngleAtom, orbitTypeAtom } from "../../atoms/simulation.ts";
import { calculateOrbitalPosition, getOrbitById, SUN_COLOR } from "../../physics/index.ts";

// Light colors for visibility against dark space background
const BODY_COLOR = "#E8E8E8"; // Light gray body
const PANEL_COLOR = "#7CB9E8"; // Light sky blue for solar panel backing
const CELL_COLOR = "#1a1a2e"; // Dark blue/black for solar cells
const SENSOR_COLOR = "#FFD700"; // Gold for telescope apertures

/**
 * 8U CubeSat dimensions (scaled for demo visibility)
 * Real 8U: 1U × 2U × 4U = 10cm × 20cm × 40cm (tall rectangular)
 * 1U = 10cm
 */
const SCALE = 0.05; // Base scale factor
const BODY = {
	width: 1 * SCALE, // X: 1U (10cm) - thin
	height: 4 * SCALE, // Y: 4U (40cm) - tall axis
	depth: 2 * SCALE, // Z: 2U (20cm)
};

// Shadow frustum size - covers full satellite extent with margin
const SHADOW_FRUSTUM = 0.4; // Half-size of shadow camera bounds
const SHADOW_LIGHT_DISTANCE = 2; // Distance from satellite center toward sun

// Solar panel dimensions (deploy from bottom face, extend horizontally in ±X)
const PANEL = {
	width: BODY.depth, // Match body depth (2U) for full coverage of large face
	length: 6 * SCALE, // Extends outward (6U long each side)
	thickness: 0.05 * SCALE, // Thin panel
};

// Solar cell grid on panels
const CELL_ROWS = 6; // Along panel length (X direction)
const CELL_COLS = 2; // Along panel width (Z direction)
const CELL_SIZE = {
	width: (PANEL.width * 0.85) / CELL_COLS,
	length: (PANEL.length * 0.9) / CELL_ROWS,
};

// Pre-generate cell grid positions (avoids array index keys)
const SOLAR_CELLS = Array.from({ length: CELL_ROWS }, (_, row) =>
	Array.from({ length: CELL_COLS }, (_, col) => ({
		id: `r${row}c${col}`,
		x: (row - (CELL_ROWS - 1) / 2) * CELL_SIZE.length,
		z: (col - (CELL_COLS - 1) / 2) * CELL_SIZE.width,
	})),
).flat();

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
		// Outer group: position only (light follows satellite but doesn't rotate)
		<group position={position}>
			{/* Dedicated shadow light for satellite self-shadowing */}
			{/* Outside rotation group so it always points from sun direction (+X) */}
			<directionalLight
				color={SUN_COLOR}
				intensity={0.5}
				position={[SHADOW_LIGHT_DISTANCE, 0, 0]}
				castShadow
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
				shadow-camera-near={0.1}
				shadow-camera-far={SHADOW_LIGHT_DISTANCE + 1}
				shadow-camera-left={-SHADOW_FRUSTUM}
				shadow-camera-right={SHADOW_FRUSTUM}
				shadow-camera-top={SHADOW_FRUSTUM}
				shadow-camera-bottom={-SHADOW_FRUSTUM}
				shadow-bias={-0.0005}
			/>

			{/* Inner group: attitude rotation (meshes rotate with satellite orientation) */}
			<group rotation={[roll, pitch, yaw]}>
				{/* Main body - 8U CubeSat bus (gray frame) */}
				<mesh castShadow receiveShadow>
					<boxGeometry args={[BODY.width, BODY.height, BODY.depth]} />
					<meshStandardMaterial color={BODY_COLOR} />
				</mesh>

				{/* Solar panel - extends in -X direction from bottom */}
				<group position={[-BODY.width / 2 - PANEL.length / 2, -BODY.height / 2, 0]}>
					{/* Panel frame */}
					<mesh castShadow receiveShadow>
						<boxGeometry args={[PANEL.length, PANEL.thickness, PANEL.width]} />
						<meshStandardMaterial color={PANEL_COLOR} />
					</mesh>
					{/* Solar cells on panel (top face, +Y) - 6x2 grid */}
					{SOLAR_CELLS.map((cell) => (
						<mesh
							key={`cell-left-${cell.id}`}
							position={[cell.x, PANEL.thickness / 2 + 0.001, cell.z]}
							receiveShadow
						>
							<boxGeometry args={[CELL_SIZE.length * 0.85, 0.002, CELL_SIZE.width * 0.85]} />
							<meshStandardMaterial color={CELL_COLOR} />
						</mesh>
					))}
				</group>

				{/* Solar panel - extends in +X direction from bottom */}
				<group position={[BODY.width / 2 + PANEL.length / 2, -BODY.height / 2, 0]}>
					{/* Panel frame */}
					<mesh castShadow receiveShadow>
						<boxGeometry args={[PANEL.length, PANEL.thickness, PANEL.width]} />
						<meshStandardMaterial color={PANEL_COLOR} />
					</mesh>
					{/* Solar cells on panel (top face, +Y) - 6x2 grid */}
					{SOLAR_CELLS.map((cell) => (
						<mesh
							key={`cell-right-${cell.id}`}
							position={[cell.x, PANEL.thickness / 2 + 0.001, cell.z]}
							receiveShadow
						>
							<boxGeometry args={[CELL_SIZE.length * 0.85, 0.002, CELL_SIZE.width * 0.85]} />
							<meshStandardMaterial color={CELL_COLOR} />
						</mesh>
					))}
				</group>

				{/* Panel hinges at bottom */}
				<mesh position={[-BODY.width / 2, -BODY.height / 2, 0]} receiveShadow>
					<boxGeometry args={[SCALE * 0.15, SCALE * 0.1, PANEL.width * 0.5]} />
					<meshStandardMaterial color="#888888" />
				</mesh>
				<mesh position={[BODY.width / 2, -BODY.height / 2, 0]} receiveShadow>
					<boxGeometry args={[SCALE * 0.15, SCALE * 0.1, PANEL.width * 0.5]} />
					<meshStandardMaterial color="#888888" />
				</mesh>

				{/* Telescope hole on top face (dark circle representing aperture) */}
				<mesh position={[0, BODY.height / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
					<cylinderGeometry args={[SCALE * 0.5, SCALE * 0.5, 0.003, 24]} />
					<meshStandardMaterial color="#111111" />
				</mesh>
				{/* Telescope rim (golden ring around hole) */}
				<mesh position={[0, BODY.height / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
					<ringGeometry args={[SCALE * 0.5, SCALE * 0.6, 24]} />
					<meshStandardMaterial color={SENSOR_COLOR} side={2} />
				</mesh>
			</group>
		</group>
	);
}
