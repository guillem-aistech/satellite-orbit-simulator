/**
 * Step Button
 *
 * Backward/forward step button for controlling the time scrubber.
 * Used in collapsed control panel for quick orbital position adjustments.
 */

import "./step_button.css";

interface StepButtonProps {
	direction: "backward" | "forward";
	onClick: () => void;
	disabled?: boolean;
}

export function StepButton({ direction, onClick, disabled }: StepButtonProps) {
	const label = direction === "backward" ? "Step backward" : "Step forward";

	return (
		<button
			type="button"
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
			className="step-button"
			aria-label={label}
			disabled={disabled}
		>
			{direction === "backward" ? (
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<title>Step backward</title>
					<path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
				</svg>
			) : (
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<title>Step forward</title>
					<path d="M13 6v12l8.5-6L13 6zM4 18l8.5-6L4 6v12z" />
				</svg>
			)}
		</button>
	);
}
