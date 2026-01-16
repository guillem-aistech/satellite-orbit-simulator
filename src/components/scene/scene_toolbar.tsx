import { useAtom } from "@effect-atom/atom-react";
import { Html, Hud, Line, OrthographicCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { Camera, Group } from "three";
import { Vector3 } from "three";
import {
	type AxisKey,
	type CameraTarget,
	cameraTargetAtom,
	selectedAxesAtom,
} from "../../atoms/camera.ts";
import { SegmentedButton, type SegmentedButtonOption } from "../ui/segmented_button.tsx";

const AXIS_LENGTH = 0.5;
const HITBOX_SIZE = 0.15;
const AXIS_COLORS = {
	x: "#ff4444",
	y: "#44ff44",
	z: "#4444ff",
};
const AXIS_COLORS_SELECTED = {
	x: "#ff8888",
	y: "#88ff88",
	z: "#8888ff",
};

// Default camera position: shows Earth with Sun visible in top-right background
const DEFAULT_CAMERA_POSITION = new Vector3(-4, 4, 6);
const DEFAULT_CAMERA_TARGET = new Vector3(0, 0, 0);

// Gizmo dimensions for margin calculation
const GIZMO_WIDTH = 100;
const GIZMO_HEIGHT = 180;
const MIN_MARGIN = 20;

// Camera view options
const CAMERA_VIEW_OPTIONS: SegmentedButtonOption<CameraTarget>[] = [
	{ value: "earth", label: "Earth" },
	{ value: "satellite", label: "Satellite" },
];

// Shared refs for camera and controls (updated via MainCameraCapture)
const cameraRef = { current: null as Camera | null };
const controlsRef = { current: null as OrbitControlsLike | null };

interface OrbitControlsLike {
	target: Vector3;
	enableRotate: boolean;
	update: () => void;
}

/** Reset camera to default position and target */
export function resetCamera() {
	if (cameraRef.current) {
		cameraRef.current.position.copy(DEFAULT_CAMERA_POSITION);
		cameraRef.current.lookAt(DEFAULT_CAMERA_TARGET);
		if (controlsRef.current) {
			controlsRef.current.target.copy(DEFAULT_CAMERA_TARGET);
			controlsRef.current.update();
		}
	}
}

interface AxisLineProps {
	axis: AxisKey;
	selected: boolean;
	onClick: () => void;
}

function AxisLine({ axis, selected, onClick }: AxisLineProps) {
	const color = selected ? AXIS_COLORS_SELECTED[axis] : AXIS_COLORS[axis];
	const positions: Record<AxisKey, [number, number, number]> = {
		x: [AXIS_LENGTH, 0, 0],
		y: [0, AXIS_LENGTH, 0],
		z: [0, 0, AXIS_LENGTH],
	};
	const labelPositions: Record<AxisKey, [number, number, number]> = {
		x: [AXIS_LENGTH + 0.15, 0, 0],
		y: [0, AXIS_LENGTH + 0.15, 0],
		z: [0, 0, AXIS_LENGTH + 0.15],
	};

	const setCursorPointer = () => {
		document.body.style.cursor = "pointer";
	};
	const setCursorDefault = () => {
		document.body.style.cursor = "default";
	};

	return (
		<group>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: R3F group is not HTML */}
			<group onClick={onClick} onPointerOver={setCursorPointer} onPointerOut={setCursorDefault}>
				<Line points={[[0, 0, 0], positions[axis]]} color={color} lineWidth={selected ? 4 : 3} />
				<mesh position={[positions[axis][0] / 2, positions[axis][1] / 2, positions[axis][2] / 2]}>
					<boxGeometry
						args={[
							axis === "x" ? AXIS_LENGTH : HITBOX_SIZE,
							axis === "y" ? AXIS_LENGTH : HITBOX_SIZE,
							axis === "z" ? AXIS_LENGTH : HITBOX_SIZE,
						]}
					/>
					<meshBasicMaterial transparent opacity={0} />
				</mesh>
			</group>

			<Html position={labelPositions[axis]} center style={{ pointerEvents: "auto" }}>
				<button
					type="button"
					onClick={onClick}
					style={{
						background: "transparent",
						border: "none",
						color: color,
						fontSize: 14,
						fontWeight: selected ? 700 : 500,
						fontFamily: "var(--font-family, system-ui)",
						cursor: "pointer",
						padding: "4px 8px",
						borderRadius: 4,
						transition: "background 0.15s",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.background = "rgba(255,255,255,0.1)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.background = "transparent";
					}}
				>
					{axis.toUpperCase()}
				</button>
			</Html>
		</group>
	);
}

function AxisGizmo({
	selectedAxes,
	onAxisClick,
}: {
	selectedAxes: AxisKey[];
	onAxisClick: (axis: AxisKey) => void;
}) {
	return (
		<group>
			<AxisLine axis="x" selected={selectedAxes.includes("x")} onClick={() => onAxisClick("x")} />
			<AxisLine axis="y" selected={selectedAxes.includes("y")} onClick={() => onAxisClick("y")} />
			<AxisLine axis="z" selected={selectedAxes.includes("z")} onClick={() => onAxisClick("z")} />
		</group>
	);
}

function SyncedAxisGizmo({
	offsetX,
	offsetY,
	selectedAxes,
	onAxisClick,
}: {
	offsetX: number;
	offsetY: number;
	selectedAxes: AxisKey[];
	onAxisClick: (axis: AxisKey) => void;
}) {
	const groupRef = useRef<Group>(null);

	// Sync gizmo rotation with main camera on each frame
	useFrame(() => {
		if (groupRef.current && cameraRef.current) {
			groupRef.current.quaternion.copy(cameraRef.current.quaternion).invert();
		}
	});

	return (
		<group position={[offsetX, offsetY, 0]}>
			<group ref={groupRef}>
				<AxisGizmo selectedAxes={selectedAxes} onAxisClick={onAxisClick} />
			</group>
		</group>
	);
}

function ResetCameraButton({ offsetX, offsetY }: { offsetX: number; offsetY: number }) {
	return (
		<Html position={[offsetX, offsetY - 0.8, 0]} center style={{ pointerEvents: "auto" }}>
			<button
				type="button"
				onClick={resetCamera}
				aria-label="Reset camera view"
				title="Reset camera view"
				style={{
					width: 32,
					height: 32,
					borderRadius: 6,
					border: "1px solid rgba(255,255,255,0.2)",
					background: "rgba(10, 10, 20, 0.8)",
					color: "#ffffff",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					transition: "background 0.2s",
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.background = "rgba(74, 157, 255, 0.3)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.background = "rgba(10, 10, 20, 0.8)";
				}}
			>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					aria-hidden="true"
				>
					<title>Reset camera</title>
					<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
					<path d="M3 3v5h5" />
				</svg>
			</button>
		</Html>
	);
}

function CameraViewToggle({ offsetX, offsetY }: { offsetX: number; offsetY: number }) {
	const [cameraTarget, setCameraTarget] = useAtom(cameraTargetAtom);

	return (
		<Html position={[offsetX, offsetY - 1.8, 0]} center style={{ pointerEvents: "auto" }}>
			<SegmentedButton
				options={CAMERA_VIEW_OPTIONS}
				value={cameraTarget}
				onChange={setCameraTarget}
			/>
		</Html>
	);
}

function ControlsHelpButton({ offsetX, offsetY }: { offsetX: number; offsetY: number }) {
	const [showHelp, setShowHelp] = useState(false);

	return (
		<Html position={[offsetX, offsetY - 1.3, 0]} center style={{ pointerEvents: "auto" }}>
			<div style={{ position: "relative" }}>
				<button
					type="button"
					onClick={() => setShowHelp(!showHelp)}
					aria-label="Show controls help"
					title="Controls help"
					style={{
						width: 32,
						height: 32,
						borderRadius: 6,
						border: "1px solid rgba(255,255,255,0.2)",
						background: showHelp ? "rgba(74, 157, 255, 0.3)" : "rgba(10, 10, 20, 0.8)",
						color: "#ffffff",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						transition: "background 0.2s",
						fontSize: 16,
						fontWeight: 600,
					}}
					onMouseEnter={(e) => {
						if (!showHelp) e.currentTarget.style.background = "rgba(74, 157, 255, 0.3)";
					}}
					onMouseLeave={(e) => {
						if (!showHelp) e.currentTarget.style.background = "rgba(10, 10, 20, 0.8)";
					}}
				>
					?
				</button>
				{showHelp && (
					<div
						style={{
							position: "absolute",
							right: 40,
							top: "50%",
							transform: "translateY(-50%)",
							background: "rgba(10, 10, 20, 0.95)",
							border: "1px solid rgba(255,255,255,0.2)",
							borderRadius: 8,
							padding: 12,
							width: 220,
							fontSize: 12,
							color: "#ffffff",
							fontFamily: "var(--font-family, system-ui)",
							lineHeight: 1.5,
							zIndex: 1000,
						}}
					>
						<div style={{ fontWeight: 600, marginBottom: 8, color: "#4A9DFF" }}>
							Navigation Controls
						</div>
						<div style={{ marginBottom: 8 }}>
							<div style={{ color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Mouse</div>
							<div>• Left drag: Rotate view</div>
							<div>• Right drag: Pan</div>
							<div>• Scroll: Zoom in/out</div>
						</div>
						<div style={{ marginBottom: 8 }}>
							<div style={{ color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Touch</div>
							<div>• One finger: Rotate</div>
							<div>• Two fingers: Pan/Zoom</div>
						</div>
						<div>
							<div style={{ color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Axis Constraint</div>
							<div>• Click axis to lock rotation</div>
							<div>• Only selected axes rotate</div>
							<div>• Click again to unlock</div>
						</div>
					</div>
				)}
			</div>
		</Html>
	);
}

// Component to capture main camera reference - updates shared ref object
export function MainCameraCapture() {
	const { camera, controls } = useThree();

	// Update refs on every render to ensure they're always current
	cameraRef.current = camera;
	if (controls && "target" in controls && "update" in controls) {
		controlsRef.current = controls as unknown as OrbitControlsLike;
	}

	// Also use effect for cleanup
	useEffect(() => {
		return () => {
			cameraRef.current = null;
			controlsRef.current = null;
		};
	}, []);

	return null;
}

export function SceneToolbar() {
	const { size } = useThree();
	const [selectedAxes, setSelectedAxes] = useAtom(selectedAxesAtom);

	const handleAxisClick = (axis: AxisKey) => {
		if (selectedAxes.includes(axis)) {
			setSelectedAxes(selectedAxes.filter((a) => a !== axis));
		} else {
			setSelectedAxes([...selectedAxes, axis]);
		}
	};

	// Calculate offset ensuring gizmo stays within viewport
	const rightEdge = size.width / 2;
	const topEdge = size.height / 2;

	const maxOffsetX = (rightEdge - GIZMO_WIDTH / 2 - MIN_MARGIN) / 100;
	const maxOffsetY = (topEdge - GIZMO_HEIGHT / 2 - MIN_MARGIN) / 100;

	const targetOffsetX = (size.width / 2 - 80) / 100;
	const targetOffsetY = (size.height / 2 - 100) / 100;

	const offsetX = Math.min(targetOffsetX, maxOffsetX);
	const offsetY = Math.min(targetOffsetY, maxOffsetY);

	return (
		<Hud>
			<OrthographicCamera makeDefault position={[0, 0, 10]} zoom={100} />
			<CameraViewToggle offsetX={offsetX} offsetY={offsetY} />
			<SyncedAxisGizmo
				offsetX={offsetX}
				offsetY={offsetY}
				selectedAxes={selectedAxes}
				onAxisClick={handleAxisClick}
			/>
			<ResetCameraButton offsetX={offsetX} offsetY={offsetY} />
			<ControlsHelpButton offsetX={offsetX} offsetY={offsetY} />
			<ambientLight intensity={1} />
		</Hud>
	);
}
