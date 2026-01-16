import { Slider as BaseSlider } from "@base-ui/react/slider";
import type { CSSProperties } from "react";
import "./slider.css";

interface SliderProps {
	value: number;
	onChange: (value: number) => void;
	min: number;
	max: number;
	step?: number;
	label?: string;
	disabled?: boolean;
	style?: CSSProperties;
	logarithmic?: boolean; // Use log scale for large ranges (e.g., 1 to 10000)
}

// Logarithmic scaling: makes slider feel linear for exponential ranges
// Example: 1→10→100→1000→10000 are evenly spaced on slider

// Convert slider position (0-1) to actual value using log scale
function logScale(position: number, min: number, max: number): number {
	const minLog = Math.log(min);
	const maxLog = Math.log(max);
	return Math.exp(minLog + position * (maxLog - minLog));
}

// Convert actual value to slider position (0-1) using log scale
function logPosition(value: number, min: number, max: number): number {
	const minLog = Math.log(min);
	const maxLog = Math.log(max);
	return (Math.log(value) - minLog) / (maxLog - minLog);
}

export function Slider({
	value,
	onChange,
	min,
	max,
	step = 1,
	label,
	disabled = false,
	style,
	logarithmic = false,
}: SliderProps) {
	// For logarithmic mode, we use 0-100 internally and convert to/from actual values
	const internalMin = logarithmic ? 0 : min;
	const internalMax = logarithmic ? 100 : max;
	const internalStep = logarithmic ? 0.1 : step;

	// Convert external value to internal slider position
	const internalValue = logarithmic ? logPosition(value, min, max) * 100 : value;

	const handleChange = (val: number) => {
		if (logarithmic) {
			// Convert internal position back to actual value
			const logVal = logScale(val / 100, min, max);
			onChange(Math.round(logVal));
		} else {
			onChange(val);
		}
	};

	return (
		<BaseSlider.Root
			value={internalValue}
			onValueChange={handleChange}
			min={internalMin}
			max={internalMax}
			step={internalStep}
			disabled={disabled}
			className="slider-root"
			{...(style ? { style } : {})}
			{...(label ? { "aria-label": label } : {})}
		>
			<BaseSlider.Control className="slider-control">
				<BaseSlider.Track className="slider-track">
					<BaseSlider.Indicator className="slider-indicator" />
					<BaseSlider.Thumb className="slider-thumb" />
				</BaseSlider.Track>
			</BaseSlider.Control>
		</BaseSlider.Root>
	);
}
