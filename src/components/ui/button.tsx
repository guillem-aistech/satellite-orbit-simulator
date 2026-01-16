import type { ReactNode } from "react";
import "./button.css";

interface ButtonProps {
	children: ReactNode;
	onClick: () => void;
	disabled?: boolean;
	variant?: "default" | "primary";
}

export function Button({ children, onClick, disabled = false, variant = "default" }: ButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`button button-${variant}`}
		>
			{children}
		</button>
	);
}
