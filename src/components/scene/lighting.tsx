import { SUN_COLOR, SUN_DISTANCE } from "../../physics/index.ts";

export function Lighting() {
	return (
		<>
			{/* Ambient: low fill light so dark side of Earth isn't pure black */}
			<ambientLight intensity={0.4} />

			{/* Directional: main sunlight with shadow casting */}
			{/* Objects need castShadow to cast, receiveShadow to receive shadows */}
			<directionalLight
				color={SUN_COLOR}
				intensity={1.5}
				position={[SUN_DISTANCE, 0, 0]}
				castShadow
				shadow-mapSize-width={1024}
				shadow-mapSize-height={1024}
				shadow-camera-far={50}
				shadow-camera-left={-5}
				shadow-camera-right={5}
				shadow-camera-top={5}
				shadow-camera-bottom={-5}
			/>
		</>
	);
}
