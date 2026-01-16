/**
 * Control Panel Component
 *
 * Main UI for controlling the satellite orbital simulation.
 *
 * ## Sections
 *
 * ### Orbit Selection
 * Dropdown to select orbit type (Dawn-Dusk SSO, Polar, ISS, etc.).
 * Each orbit has different inclination, RAAN, period, and altitude.
 *
 * ### Simulation Controls
 * - **Play/Pause**: Start/stop time progression
 * - **Time Scale**: Speed multiplier (1x to 10000x, logarithmic)
 * - **Time Scrubber**: Manual time control (only when paused)
 *   - Range: ±1 full orbit from pause position
 *   - Independent of time scale for consistent UX
 * - **Reset**: Resets attitude, time, and camera (not time scale)
 *
 * ### Attitude Controls
 * Manual satellite orientation adjustments:
 * - **Roll**: Rotation around forward axis (±180°)
 * - **Pitch**: Nose up/down (±180°)
 * - **Yaw**: Nose left/right (±180°)
 *
 * ### Readouts
 * Real-time display of simulation state:
 * - Elapsed simulation time
 * - Current orbital angle
 * - Time scale multiplier
 *
 * ## State Management
 * Uses Effect Atom for reactive state. Key atoms:
 * - `isPlayingAtom`: Play/pause state
 * - `timeScaleAtom`: Speed multiplier
 * - `elapsedTimeAtom`: Simulation time in seconds
 * - `orbitalAngleAtom`: Satellite position (0 to 2π)
 * - `orbitTypeAtom`: Selected orbit ID
 * - `rollAtom`, `pitchAtom`, `yawAtom`: Attitude angles
 *
 * ## Collapsed Mode
 * When collapsed, shows minimal controls:
 * - Step backward/forward buttons
 * - Play/pause button
 * - Current time
 */

import { useAtom, useAtomValue } from "@effect-atom/atom-react";
import { useEffect, useRef, useState } from "react";
import { pitchAtom, rollAtom, yawAtom } from "../../atoms/satellite.ts";
import {
	elapsedTimeAtom,
	isPlayingAtom,
	orbitalAngleAtom,
	orbitTypeAtom,
	timeScaleAtom,
} from "../../atoms/simulation.ts";
import { getOrbitById } from "../../physics/index.ts";
import { formatAngle, formatTime, formatTimeScale } from "../../utils/formatting.ts";
import { resetCamera } from "../scene/scene_toolbar.tsx";
import { Button } from "./button.tsx";
import { OrbitSelector } from "./orbit_selector.tsx";
import { PlayPauseButton } from "./play_pause.tsx";
import { Readout } from "./readout.tsx";
import { Slider } from "./slider.tsx";
import { XStack, YStack } from "./stack.tsx";
import { StepButton } from "./step_button.tsx";
import "./control_panel.css";

/**
 * Time scrubber range in radians (±1 full orbit).
 * This is independent of time scale for consistent user experience.
 */
const SCRUBBER_ANGLE_RANGE = Math.PI * 2;

/** Step size for time scrubber buttons (30 degrees = 1/12 of a full orbit) */
const SCRUBBER_STEP = Math.PI / 6;

/** Chevron icon for expand/collapse toggle */
function ChevronIcon({ expanded }: { expanded: boolean }) {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			className={`chevron-icon ${expanded ? "expanded" : ""}`}
			aria-hidden="true"
		>
			<title>{expanded ? "Collapse" : "Expand"}</title>
			<path
				d="M5 12.5L10 7.5L15 12.5"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

const MOBILE_BREAKPOINT = 600;

export function ControlPanel() {
	const [isExpanded, setIsExpanded] = useState(() => window.innerWidth >= MOBILE_BREAKPOINT);
	const isPlaying = useAtomValue(isPlayingAtom);
	const [timeScale, setTimeScale] = useAtom(timeScaleAtom);
	const [roll, setRoll] = useAtom(rollAtom);
	const [pitch, setPitch] = useAtom(pitchAtom);
	const [yaw, setYaw] = useAtom(yawAtom);
	const [orbitalAngle, setOrbitalAngle] = useAtom(orbitalAngleAtom);
	const [elapsedTime, setElapsedTime] = useAtom(elapsedTimeAtom);
	const orbitTypeId = useAtomValue(orbitTypeAtom);

	// Track scrubber offset directly (not derived from angle to avoid wrap issues)
	const [scrubberOffset, setScrubberOffset] = useState(0);
	const pauseTimeRef = useRef(elapsedTime);
	const pauseAngleRef = useRef(orbitalAngle);
	const wasPlayingRef = useRef(isPlaying);

	const selectedOrbit = getOrbitById(orbitTypeId);

	// Handle play/pause transitions
	useEffect(() => {
		if (wasPlayingRef.current && !isPlaying) {
			// Just paused - capture current position as scrubber center
			pauseTimeRef.current = elapsedTime;
			pauseAngleRef.current = orbitalAngle;
			setScrubberOffset(0); // Reset scrubber to center
		}
		wasPlayingRef.current = isPlaying;
	}, [isPlaying, elapsedTime, orbitalAngle]);

	/**
	 * Handle time scrubber changes.
	 * Scrubber controls orbital angle directly (±1 orbit range).
	 * Elapsed time is calculated from angle change using orbital period.
	 */
	const handleScrubberChange = (angleOffset: number) => {
		setScrubberOffset(angleOffset);

		// Calculate new orbital angle
		const newAngle = pauseAngleRef.current + angleOffset;
		// Normalize to 0-2π for actual state
		const normalizedAngle = ((newAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

		// Calculate corresponding time change
		const deltaTime = (angleOffset / (2 * Math.PI)) * selectedOrbit.period;
		const newTime = Math.max(0, pauseTimeRef.current + deltaTime);

		setOrbitalAngle(normalizedAngle);
		setElapsedTime(newTime);
	};

	/**
	 * Step the time scrubber by a fixed increment.
	 * Pauses the simulation if playing.
	 */
	const handleScrubberStep = (direction: "backward" | "forward") => {
		const multiplier = direction === "backward" ? -1 : 1;
		const newOffset = Math.max(
			-SCRUBBER_ANGLE_RANGE,
			Math.min(SCRUBBER_ANGLE_RANGE, scrubberOffset + multiplier * SCRUBBER_STEP),
		);
		handleScrubberChange(newOffset);
	};

	/**
	 * Reset simulation to initial state.
	 * Resets: attitude (roll, pitch, yaw), time, orbital position, camera view.
	 * Preserves: time scale (user preference).
	 */
	const handleReset = () => {
		// Reset satellite attitude
		setRoll(0);
		setPitch(0);
		setYaw(0);
		// Reset time and position
		setOrbitalAngle(0);
		setElapsedTime(0);
		// Reset scrubber
		setScrubberOffset(0);
		pauseTimeRef.current = 0;
		pauseAngleRef.current = 0;
		// Reset camera view
		resetCamera();
	};

	/** Reset attitude (roll, pitch, yaw) to neutral position */
	const handleAttitudeReset = () => {
		setRoll(0);
		setPitch(0);
		setYaw(0);
	};

	return (
		<div className={`control-panel ${isExpanded ? "expanded" : "collapsed"}`}>
			{/* Header bar - always visible, toggles expand/collapse */}
			<button
				type="button"
				className="panel-header"
				onClick={() => setIsExpanded(!isExpanded)}
				aria-expanded={isExpanded}
				aria-label={isExpanded ? "Collapse controls" : "Expand controls"}
			>
				<XStack gap="sm" align="center">
					<span className="panel-title">Controls</span>
					{/* Collapsed mode: show minimal inline controls */}
					{!isExpanded && (
						<XStack gap="sm" align="center" className="collapsed-controls">
							<XStack gap="xs" align="center" className="collapsed-playback-controls">
								<StepButton
									direction="backward"
									onClick={() => handleScrubberStep("backward")}
									disabled={scrubberOffset <= -SCRUBBER_ANGLE_RANGE}
								/>
								<PlayPauseButton />
								<StepButton
									direction="forward"
									onClick={() => handleScrubberStep("forward")}
									disabled={scrubberOffset >= SCRUBBER_ANGLE_RANGE}
								/>
							</XStack>
							<span className="collapsed-status">{formatTime(elapsedTime)}</span>
						</XStack>
					)}
				</XStack>
				<ChevronIcon expanded={isExpanded} />
			</button>

			{/* Collapsible content - full controls */}
			<div className="panel-content">
				<XStack gap="lg" wrap align="flex-start">
					{/* Orbit Selection */}
					<YStack gap="sm" className="control-section">
						<span className="section-title">Orbit</span>
						<OrbitSelector />
					</YStack>

					{/* Simulation Controls */}
					<YStack gap="sm" className="control-section">
						<span className="section-title">Simulation</span>
						<XStack gap="sm" align="center">
							<PlayPauseButton />
							<span className="slider-label">{isPlaying ? "Playing" : "Paused"}</span>
						</XStack>
						<YStack gap="xs">
							<span className="slider-label">Time Scale: {formatTimeScale(timeScale)}</span>
							<Slider
								value={timeScale}
								onChange={setTimeScale}
								min={1}
								max={10000}
								logarithmic
								label="Time Scale"
							/>
						</YStack>
						<YStack gap="xs">
							<span className="slider-label">
								Time Scrubber {isPlaying ? "(pause to use)" : ""}
							</span>
							<Slider
								value={scrubberOffset}
								onChange={handleScrubberChange}
								min={-SCRUBBER_ANGLE_RANGE}
								max={SCRUBBER_ANGLE_RANGE}
								step={0.01}
								disabled={isPlaying}
								label="Time Scrubber"
							/>
						</YStack>
						<Button onClick={handleReset}>Reset</Button>
					</YStack>

					{/* Attitude Controls */}
					<YStack gap="sm" className="control-section">
						<span className="section-title">Attitude</span>
						<YStack gap="xs">
							<span className="slider-label">Roll: {formatAngle(roll)}</span>
							<Slider
								value={roll}
								onChange={setRoll}
								min={-Math.PI}
								max={Math.PI}
								step={0.01}
								label="Roll"
							/>
						</YStack>
						<YStack gap="xs">
							<span className="slider-label">Pitch: {formatAngle(pitch)}</span>
							<Slider
								value={pitch}
								onChange={setPitch}
								min={-Math.PI}
								max={Math.PI}
								step={0.01}
								label="Pitch"
							/>
						</YStack>
						<YStack gap="xs">
							<span className="slider-label">Yaw: {formatAngle(yaw)}</span>
							<Slider
								value={yaw}
								onChange={setYaw}
								min={-Math.PI}
								max={Math.PI}
								step={0.01}
								label="Yaw"
							/>
						</YStack>
						<Button onClick={handleAttitudeReset}>Reset</Button>
					</YStack>

					{/* Readouts */}
					<YStack gap="sm" className="control-section">
						<span className="section-title">Readouts</span>
						<Readout label="Time:" value={formatTime(elapsedTime)} />
						<Readout label="Orbit:" value={formatAngle(orbitalAngle)} />
						<Readout label="Scale:" value={formatTimeScale(timeScale)} />
					</YStack>
				</XStack>
			</div>
		</div>
	);
}
