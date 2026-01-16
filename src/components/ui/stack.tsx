import type { CSSProperties, ReactNode } from "react";

// Stack components: flexbox layouts with consistent spacing
// XStack = horizontal (row), YStack = vertical (column)

type Space = "xs" | "sm" | "md" | "lg" | "xl"; // Maps to CSS tokens in tokens.css

interface StackProps {
	children: ReactNode;
	gap?: Space; // Space between children
	align?: CSSProperties["alignItems"]; // Cross-axis alignment
	justify?: CSSProperties["justifyContent"]; // Main-axis alignment
	wrap?: boolean; // Allow wrapping to multiple lines
	className?: string;
	style?: CSSProperties;
}

// Convert space token to CSS variable reference
const spaceVar = (space: Space) => `var(--space-${space})`;

export function XStack({
	children,
	gap = "sm",
	align = "center",
	justify = "flex-start",
	wrap = false,
	className,
	style,
}: StackProps) {
	return (
		<div
			className={className}
			style={{
				display: "flex",
				flexDirection: "row",
				gap: spaceVar(gap),
				alignItems: align,
				justifyContent: justify,
				flexWrap: wrap ? "wrap" : "nowrap",
				...style,
			}}
		>
			{children}
		</div>
	);
}

export function YStack({
	children,
	gap = "sm",
	align = "stretch",
	justify = "flex-start",
	wrap = false,
	className,
	style,
}: StackProps) {
	return (
		<div
			className={className}
			style={{
				display: "flex",
				flexDirection: "column",
				gap: spaceVar(gap),
				alignItems: align,
				justifyContent: justify,
				flexWrap: wrap ? "wrap" : "nowrap",
				...style,
			}}
		>
			{children}
		</div>
	);
}
