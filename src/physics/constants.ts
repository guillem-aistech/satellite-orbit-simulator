/**
 * Physical constants for the simulation.
 * All values are in scene units (not real-world scale).
 * See docs/SIMULATION_SPECS.md for scale factors.
 */

// ============================================================================
// REAL-WORLD CONSTANTS (for accurate orbital mechanics)
// ============================================================================

/** Earth's gravitational parameter GM (m³/s²) */
export const EARTH_MU = 3.986004418e14;

/** Earth's real radius in kilometers */
export const EARTH_RADIUS_KM = 6371;

/** Earth's real radius in meters */
export const EARTH_RADIUS_M = EARTH_RADIUS_KM * 1000;

/**
 * Calculate orbital velocity for a given altitude.
 * v = √(GM/r) where r = Earth radius + altitude
 *
 * @param altitudeKm - Altitude above Earth's surface in kilometers
 * @returns Orbital velocity in km/s
 */
export function calculateOrbitalVelocityKmS(altitudeKm: number): number {
	const radiusM = (EARTH_RADIUS_KM + altitudeKm) * 1000;
	const velocityMs = Math.sqrt(EARTH_MU / radiusM);
	return velocityMs / 1000; // Convert m/s to km/s
}

/**
 * Calculate orbital period for a given altitude.
 * T = 2π × √(a³/μ) where a = Earth radius + altitude
 *
 * @param altitudeKm - Altitude above Earth's surface in kilometers
 * @returns Orbital period in seconds
 */
export function calculateOrbitalPeriod(altitudeKm: number): number {
	const radiusM = (EARTH_RADIUS_KM + altitudeKm) * 1000;
	return 2 * Math.PI * Math.sqrt(radiusM ** 3 / EARTH_MU);
}

/** Reference altitudes for different orbit types (km) */
export const ORBIT_ALTITUDES = {
	iss: 420,
	leo: 450,
	sso: 500,
	polar: 550,
} as const;

/** Pre-calculated orbital velocities for common altitudes (km/s) */
export const ORBITAL_VELOCITIES = {
	/** ISS orbit at 420km: ~7.66 km/s */
	iss: calculateOrbitalVelocityKmS(420),
	/** LEO at 450km: ~7.64 km/s */
	leo: calculateOrbitalVelocityKmS(450),
	/** SSO at 500km: ~7.61 km/s */
	sso: calculateOrbitalVelocityKmS(500),
	/** Polar at 550km: ~7.59 km/s */
	polar: calculateOrbitalVelocityKmS(550),
} as const;

// ============================================================================
// SCENE SCALE CONSTANTS (visualization, not real scale)
// ============================================================================

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

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/** Convert degrees to radians */
export const degToRad = (deg: number): number => (deg * Math.PI) / 180;

/** Convert radians to degrees */
export const radToDeg = (rad: number): number => (rad * 180) / Math.PI;

// ============================================================================
// EARTH ROTATION CONSTANTS
// ============================================================================

/** Earth sidereal day in seconds (23h 56m 4s) */
export const EARTH_SIDEREAL_DAY = 86164;

/** Initial rotation offset to align Prime Meridian with Sun (facing +X) */
export const EARTH_INITIAL_ROTATION = -Math.PI / 2;

/** Earth's rotation rate in radians per second */
export const EARTH_ROTATION_RATE = (2 * Math.PI) / EARTH_SIDEREAL_DAY;
