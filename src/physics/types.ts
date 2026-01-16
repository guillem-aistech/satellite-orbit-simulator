/** Axis identifier for 3D coordinates */
export type AxisKey = "x" | "y" | "z";

/** 3D position tuple */
export type Position3D = [number, number, number];

/** Orbit type definition for satellite missions */
export interface OrbitType {
	id: string;
	name: string;
	description: string;
	/** Degrees from equatorial plane */
	inclination: number;
	/** Relative to base altitude */
	altitudeMultiplier: number;
	/** Orbital period in seconds */
	period: number;
	/** Local Time of Ascending Node (HH:MM) for SSO */
	ltan?: string;
	/** Right Ascension of Ascending Node in degrees */
	raan: number;
}
