import { useAtom, useAtomValue } from "@effect-atom/atom-react";
import { useFrame } from "@react-three/fiber";
import {
	elapsedTimeAtom,
	isPlayingAtom,
	orbitalAngleAtom,
	orbitTypeAtom,
	timeScaleAtom,
} from "../../atoms/simulation.ts";
import { calculateDeltaAngle, getOrbitById } from "../../physics/index.ts";

// Updates simulation state each frame when playing
// This is the "game loop" that drives the animation
export function AnimationController() {
	const isPlaying = useAtomValue(isPlayingAtom);
	const timeScale = useAtomValue(timeScaleAtom); // Speed multiplier (1x to 10000x)
	const orbitTypeId = useAtomValue(orbitTypeAtom);
	const [, setOrbitalAngle] = useAtom(orbitalAngleAtom);
	const [, setElapsedTime] = useAtom(elapsedTimeAtom);

	const selectedOrbit = getOrbitById(orbitTypeId);

	// useFrame runs every animation frame (~60fps)
	// delta = seconds since last frame (typically ~0.016s)
	useFrame((_, delta) => {
		if (!isPlaying) return;

		// Apply time scale to speed up simulation
		const scaledDelta = delta * timeScale;
		// Convert time to orbital angle change based on orbit period
		const deltaAngle = calculateDeltaAngle(selectedOrbit, scaledDelta);

		// Update orbital position (wraps at 2π)
		setOrbitalAngle((prev: number) => (prev + deltaAngle) % (2 * Math.PI));
		setElapsedTime((prev: number) => prev + scaledDelta);
	});

	// Renders nothing - just updates state
	return null;
}
