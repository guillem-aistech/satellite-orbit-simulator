import { SUN_COLOR, SUN_DISTANCE, SUN_RADIUS } from "../../physics/index.ts";

export function Sun() {
	return (
		// Position Sun on X axis (not to scale - sized for visual clarity)
		<group position={[SUN_DISTANCE, 0, 0]}>
			{/* Sun sphere - uses BasicMaterial so it's always bright (ignores lighting) */}
			<mesh>
				<sphereGeometry args={[SUN_RADIUS, 32, 32]} />
				<meshBasicMaterial color={SUN_COLOR} />
			</mesh>

			{/* Light source that illuminates the scene from Sun's position */}
			<pointLight color={SUN_COLOR} intensity={2} distance={50} decay={0.5} />
		</group>
	);
}
