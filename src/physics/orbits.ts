import { calculateOrbitalPeriod } from "./constants.ts";
import type { OrbitType } from "./types.ts";

/** Convert LTAN (HH:MM) to RAAN in degrees */
export function ltanToRaan(ltan: string): number {
	const parts = ltan.split(":").map(Number);
	const hours = parts[0] ?? 0;
	const minutes = parts[1] ?? 0;
	const ltanHours = hours + minutes / 60;
	return (ltanHours - 12) * 15; // 15° per hour from noon
}

/** Default orbit: Dawn-Dusk SSO for thermal imaging */
export const DEFAULT_ORBIT: OrbitType = {
	id: "dawn-dusk",
	name: "Dawn-Dusk SSO",
	description: "Flies along terminator. Optimal for thermal imaging.",
	inclination: 98,
	altitudeMultiplier: 1.0,
	altitudeKm: 500,
	period: calculateOrbitalPeriod(500), // ~5677s (~94.6 min)
	ltan: "06:00",
	raan: ltanToRaan("06:00"), // -90°
};

/** All available orbit types */
export const ORBIT_TYPES: OrbitType[] = [
	DEFAULT_ORBIT,
	{
		id: "sso-morning",
		name: "Mid-Morning SSO",
		description: "Standard Earth observation orbit. Good illumination.",
		inclination: 98,
		altitudeMultiplier: 1.0,
		altitudeKm: 500,
		period: calculateOrbitalPeriod(500),
		ltan: "10:30",
		raan: ltanToRaan("10:30"), // -22.5°
	},
	{
		id: "sso-noon",
		name: "Noon-Midnight SSO",
		description: "Maximum illumination contrast. High thermal gradients.",
		inclination: 98,
		altitudeMultiplier: 1.0,
		altitudeKm: 500,
		period: calculateOrbitalPeriod(500),
		ltan: "12:00",
		raan: ltanToRaan("12:00"), // 0°
	},
	{
		id: "polar",
		name: "Polar Orbit",
		description: "Full Earth coverage. Variable lighting conditions.",
		inclination: 90,
		altitudeMultiplier: 1.1,
		altitudeKm: 550,
		period: calculateOrbitalPeriod(550), // ~5765s (~96.1 min)
		raan: 0,
	},
	{
		id: "iss",
		name: "ISS Orbit",
		description: "Common for CubeSat deployments. Covers ±51.6° latitude.",
		inclination: 51.6,
		altitudeMultiplier: 0.84,
		altitudeKm: 420,
		period: calculateOrbitalPeriod(420), // ~5555s (~92.6 min)
		raan: 0,
	},
	{
		id: "leo",
		name: "Low Earth Orbit (LEO)",
		description: "General purpose mid-inclination. Technology demos.",
		inclination: 45,
		altitudeMultiplier: 0.9,
		altitudeKm: 450,
		period: calculateOrbitalPeriod(450), // ~5600s (~93.3 min)
		raan: 0,
	},
	{
		id: "equatorial",
		name: "Equatorial",
		description: "Zero inclination. Equatorial region coverage only.",
		inclination: 0,
		altitudeMultiplier: 1.0,
		altitudeKm: 500,
		period: calculateOrbitalPeriod(500),
		raan: 0,
	},
];

/** Default orbit type ID */
export const DEFAULT_ORBIT_TYPE = "dawn-dusk";

/** Find orbit by ID, returns default if not found */
export function getOrbitById(id: string): OrbitType {
	return ORBIT_TYPES.find((o) => o.id === id) ?? DEFAULT_ORBIT;
}
