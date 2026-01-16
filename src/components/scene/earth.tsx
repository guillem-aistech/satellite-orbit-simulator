import { useAtomValue } from "@effect-atom/atom-react";
import { useTexture } from "@react-three/drei";
import { elapsedTimeAtom } from "../../atoms/simulation.ts";
import { calculateEarthRotation, EARTH_RADIUS } from "../../physics/index.ts";

export function Earth() {
	const elapsedTime = useAtomValue(elapsedTimeAtom);

	// Load textures from /public/textures/
	const dayMap = useTexture("/textures/earth_daymap.jpg"); // Color texture
	const bumpMap = useTexture("/textures/earth_bump.jpg"); // Surface relief

	// Earth rotates around Y axis based on simulation time
	const earthRotation = calculateEarthRotation(elapsedTime);

	return (
		// receiveShadow: allows satellite shadow to appear on Earth
		// rotation: [X, Y, Z] in radians - we rotate around Y axis
		<mesh receiveShadow rotation={[0, earthRotation, 0]}>
			{/* 64 segments for smooth sphere appearance */}
			<sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
			{/* Standard material responds to scene lighting */}
			<meshStandardMaterial map={dayMap} bumpMap={bumpMap} bumpScale={0.05} />
		</mesh>
	);
}
