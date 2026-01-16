/** Format elapsed time as HH:MM:SS */
export function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	return [hours, minutes, secs].map((n) => n.toString().padStart(2, "0")).join(":");
}

/** Format angle from radians to degrees with sign */
export function formatAngle(radians: number): string {
	const degrees = (radians * 180) / Math.PI;
	const sign = degrees >= 0 ? "+" : "";
	return `${sign}${degrees.toFixed(1)}°`;
}

/** Format time scale multiplier */
export function formatTimeScale(scale: number): string {
	return `${scale.toFixed(1)}x`;
}
