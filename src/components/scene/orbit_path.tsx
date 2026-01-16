import { useAtomValue } from "@effect-atom/atom-react";
import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { orbitTypeAtom } from "../../atoms/simulation.ts";
import { calculateOrbitPath, getOrbitById } from "../../physics/index.ts";

const ORBIT_COLOR = "#FFFFFF";
const ORBIT_OPACITY = 0.3;

// Draws the satellite's orbital path as a dashed line around Earth
export function OrbitPath() {
	const orbitTypeId = useAtomValue(orbitTypeAtom);
	const selectedOrbit = getOrbitById(orbitTypeId);

	// Calculate orbit ellipse points - recalculated when orbit type changes
	const points = useMemo(() => calculateOrbitPath(selectedOrbit), [selectedOrbit]);

	return (
		// Line component from drei - renders a line through array of points
		<Line
			points={points}
			color={ORBIT_COLOR}
			lineWidth={1}
			transparent
			opacity={ORBIT_OPACITY}
			dashed
			dashSize={0.02}
			gapSize={0.01}
		/>
	);
}
