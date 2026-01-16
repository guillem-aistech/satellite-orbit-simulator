/**
 * Play/Pause Button
 *
 * Compact play/pause button with icon for controlling simulation playback.
 * Connects directly to isPlayingAtom.
 */

import { useAtom } from "@effect-atom/atom-react";
import { isPlayingAtom } from "../../atoms/simulation.ts";
import "./play_pause.css";

export function PlayPauseButton() {
	const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);

	return (
		<button
			type="button"
			onClick={(e) => {
				e.stopPropagation();
				setIsPlaying(!isPlaying);
			}}
			className="play-pause-button"
			aria-label={isPlaying ? "Pause" : "Play"}
		>
			{isPlaying ? (
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<title>Pause</title>
					<rect x="6" y="4" width="4" height="16" />
					<rect x="14" y="4" width="4" height="16" />
				</svg>
			) : (
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<title>Play</title>
					<path d="M8 5v14l11-7z" />
				</svg>
			)}
		</button>
	);
}
