import { XStack } from "./stack.tsx";
import "./readout.css";

interface ReadoutProps {
	label: string;
	value: string;
}

export function Readout({ label, value }: ReadoutProps) {
	return (
		<XStack gap="xs" className="readout">
			<span className="readout-label">{label}</span>
			<span className="readout-value">{value}</span>
		</XStack>
	);
}
