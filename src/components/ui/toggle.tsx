import { Switch } from "@base-ui/react/switch";
import "./toggle.css";

interface ToggleProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: string;
	disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
	return (
		<Switch.Root
			checked={checked}
			onCheckedChange={onChange}
			disabled={disabled}
			className="toggle-root"
			aria-label={label}
		>
			<Switch.Thumb className="toggle-thumb" />
		</Switch.Root>
	);
}
