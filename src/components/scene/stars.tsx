import { useMemo } from "react";

const STAR_COUNT = 300;
const STAR_SPREAD = 50; // Distance from center (radius of star sphere)

interface Star {
	id: string;
	position: [number, number, number];
	size: number;
	opacity: number;
}

export function Stars() {
	// Generate stars once on mount (useMemo with empty deps)
	const stars = useMemo<Star[]>(() => {
		const result: Star[] = [];

		for (let i = 0; i < STAR_COUNT; i++) {
			// Distribute evenly on sphere surface using spherical coordinates
			const theta = Math.random() * Math.PI * 2; // Longitude (0 to 2π)
			const phi = Math.acos(2 * Math.random() - 1); // Latitude (0 to π)
			const r = STAR_SPREAD;

			// Convert spherical to cartesian coordinates
			result.push({
				id: `star-${i}`,
				position: [
					r * Math.sin(phi) * Math.cos(theta),
					r * Math.sin(phi) * Math.sin(theta),
					r * Math.cos(phi),
				],
				size: 0.1 + Math.random() * 0.04,
				opacity: 0.3 + Math.random() * 0.5,
			});
		}

		return result;
	}, []);

	return (
		<group>
			{stars.map((star) => (
				<mesh key={star.id} position={star.position}>
					<sphereGeometry args={[star.size, 8, 8]} />
					{/* BasicMaterial = always white, ignores scene lighting */}
					<meshBasicMaterial color="#ffffff" transparent opacity={star.opacity} />
				</mesh>
			))}
		</group>
	);
}
