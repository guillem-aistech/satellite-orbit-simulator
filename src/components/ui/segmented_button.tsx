import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import "./segmented_button.css";

export interface SegmentedButtonOption<T extends string> {
	value: T;
	label: string;
}

interface SegmentedButtonProps<T extends string> {
	options: SegmentedButtonOption<T>[];
	value: T;
	onChange: (value: T) => void;
	disabled?: boolean;
}

export function SegmentedButton<T extends string>({
	options,
	value,
	onChange,
	disabled = false,
}: SegmentedButtonProps<T>) {
	return (
		<ToggleGroup
			value={[value]}
			onValueChange={(newValue) => {
				if (newValue.length > 0) {
					onChange(newValue[0] as T);
				}
			}}
			disabled={disabled}
			className="segmented-button-group"
		>
			{options.map((option) => (
				<Toggle key={option.value} value={option.value} className="segmented-button-item">
					{option.label}
				</Toggle>
			))}
		</ToggleGroup>
	);
}
