/**
 * Physical constants for the simulation.
 * All values are in scene units (not real-world scale).
 * See docs/SIMULATION_SPECS.md for scale factors.
 */

/** Earth radius in scene units */
export const EARTH_RADIUS = 1;

/** Base satellite altitude (exaggerated for visibility) */
export const BASE_ALTITUDE = 0.6;

/** Default orbital radius */
export const ORBIT_RADIUS = EARTH_RADIUS + BASE_ALTITUDE;

/** Orbital period at 500km altitude in seconds */
export const ORBITAL_PERIOD = 5667;

/** Sun distance from Earth center (compressed for framing) */
export const SUN_DISTANCE = 15;

/** Sun radius (compressed for framing) */
export const SUN_RADIUS = 1.5;

/** Sun color temperature */
export const SUN_COLOR = "#FFF5E0";

/** Convert degrees to radians */
export const degToRad = (deg: number): number => (deg * Math.PI) / 180;

/** Convert radians to degrees */
export const radToDeg = (rad: number): number => (rad * 180) / Math.PI;

/** Earth sidereal day in seconds (23h 56m 4s) */
export const EARTH_SIDEREAL_DAY = 86164;

/** Initial rotation offset to align Prime Meridian with Sun (facing +X) */
export const EARTH_INITIAL_ROTATION = -Math.PI / 2;
