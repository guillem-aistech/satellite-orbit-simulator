import { useAtom } from "@effect-atom/atom-react";
import { orbitTypeAtom } from "../../atoms/simulation.ts";
import { getOrbitById, ORBIT_TYPES } from "../../physics/index.ts";
import { YStack } from "./stack.tsx";
import "./orbit_selector.css";

export function OrbitSelector() {
	const [orbitTypeId, setOrbitTypeId] = useAtom(orbitTypeAtom);

	const selectedOrbit = getOrbitById(orbitTypeId);

	return (
		<YStack gap="xs">
			<label className="orbit-selector-label" htmlFor="orbit-select">
				Orbit Type
			</label>
			<select
				id="orbit-select"
				className="orbit-selector"
				value={orbitTypeId}
				onChange={(e) => setOrbitTypeId(e.target.value)}
			>
				{ORBIT_TYPES.map((orbit) => (
					<option key={orbit.id} value={orbit.id}>
						{orbit.name}
					</option>
				))}
			</select>
			<span className="orbit-description">{selectedOrbit.description}</span>
		</YStack>
	);
}
