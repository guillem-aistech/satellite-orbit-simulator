// Types

// Constants
export {
	BASE_ALTITUDE,
	calculateOrbitalPeriod,
	calculateOrbitalVelocityKmS,
	degToRad,
	EARTH_INITIAL_ROTATION,
	EARTH_MU,
	EARTH_RADIUS,
	EARTH_RADIUS_KM,
	EARTH_RADIUS_M,
	EARTH_ROTATION_RATE,
	EARTH_SIDEREAL_DAY,
	ORBIT_ALTITUDES,
	ORBIT_RADIUS,
	ORBITAL_PERIOD,
	ORBITAL_VELOCITIES,
	radToDeg,
	SUN_COLOR,
	SUN_DISTANCE,
	SUN_RADIUS,
} from "./constants.ts";
// Orbits
export {
	DEFAULT_ORBIT,
	DEFAULT_ORBIT_TYPE,
	getOrbitById,
	ltanToRaan,
	ORBIT_TYPES,
} from "./orbits.ts";
// Position and motion calculations
export {
	calculateDeltaAngle,
	calculateEarthRotation,
	calculateOrbitalAngularVelocity,
	calculateOrbitalPosition,
	calculateOrbitPath,
	calculateOrbitRadius,
} from "./position.ts";
export type { AxisKey, OrbitType, Position3D } from "./types.ts";
