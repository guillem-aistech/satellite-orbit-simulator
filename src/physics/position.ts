import {
	BASE_ALTITUDE,
	degToRad,
	EARTH_INITIAL_ROTATION,
	EARTH_RADIUS,
	EARTH_SIDEREAL_DAY,
} from "./constants.ts";
import type { OrbitType, Position3D } from "./types.ts";

/**
 * Calculate satellite position on an inclined, rotated orbital plane.
 *
 * @param orbitalAngle - Current position in orbit (0 to 2π radians)
 * @param orbit - Orbit type configuration
 * @returns 3D position [x, y, z] in scene coordinates
 *
 * Coordinate system:
 * - X: Points toward Sun (positive)
 * - Y: North pole (positive)
 * - Z: Completes right-hand system
 */
export function calculateOrbitalPosition(orbitalAngle: number, orbit: OrbitType): Position3D {
	const radius = EARTH_RADIUS + BASE_ALTITUDE * orbit.altitudeMultiplier;
	const inclination = degToRad(orbit.inclination);
	const raan = degToRad(orbit.raan);

	// Position in orbital plane (before RAAN rotation)
	const xPrime = Math.cos(orbitalAngle) * radius;
	const yPrime = Math.sin(orbitalAngle) * radius * Math.sin(inclination);
	const zPrime = Math.sin(orbitalAngle) * radius * Math.cos(inclination);

	// Apply RAAN rotation around Y-axis
	const x = xPrime * Math.cos(raan) + zPrime * Math.sin(raan);
	const y = yPrime;
	const z = -xPrime * Math.sin(raan) + zPrime * Math.cos(raan);

	return [x, y, z];
}

/**
 * Generate points along an orbital path.
 *
 * @param orbit - Orbit type configuration
 * @param segments - Number of line segments (default 128)
 * @returns Array of 3D positions forming the orbit path
 */
export function calculateOrbitPath(orbit: OrbitType, segments = 128): Position3D[] {
	const points: Position3D[] = [];

	for (let i = 0; i <= segments; i++) {
		const angle = (i / segments) * Math.PI * 2;
		points.push(calculateOrbitalPosition(angle, orbit));
	}

	return points;
}

/**
 * Calculate orbital radius for a given orbit type.
 *
 * @param orbit - Orbit type configuration
 * @returns Orbital radius in scene units
 */
export function calculateOrbitRadius(orbit: OrbitType): number {
	return EARTH_RADIUS + BASE_ALTITUDE * orbit.altitudeMultiplier;
}

/**
 * Calculate Earth's rotation angle based on elapsed simulation time.
 * Uses sidereal day (23h 56m 4s) for accurate stellar reference.
 *
 * @param elapsedTime - Elapsed simulation time in seconds
 * @returns Rotation angle in radians (Y-axis rotation)
 */
export function calculateEarthRotation(elapsedTime: number): number {
	return EARTH_INITIAL_ROTATION + (elapsedTime / EARTH_SIDEREAL_DAY) * 2 * Math.PI;
}

/**
 * Calculate orbital angular velocity for a given orbit.
 *
 * @param orbit - Orbit type configuration
 * @returns Angular velocity in radians per second
 */
export function calculateOrbitalAngularVelocity(orbit: OrbitType): number {
	return (2 * Math.PI) / orbit.period;
}

/**
 * Calculate change in orbital angle for a time step.
 *
 * @param orbit - Orbit type configuration
 * @param deltaTime - Time step in seconds
 * @returns Angle change in radians
 */
export function calculateDeltaAngle(orbit: OrbitType, deltaTime: number): number {
	return calculateOrbitalAngularVelocity(orbit) * deltaTime;
}
