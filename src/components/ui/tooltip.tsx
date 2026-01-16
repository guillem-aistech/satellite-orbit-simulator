import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactNode } from "react";
import "./tooltip.css";

interface TooltipProps {
	children: ReactNode;
	content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
	return (
		<BaseTooltip.Provider>
			<BaseTooltip.Root>
				<BaseTooltip.Trigger className="tooltip-trigger">{children}</BaseTooltip.Trigger>
				<BaseTooltip.Portal>
					<BaseTooltip.Positioner sideOffset={8}>
						<BaseTooltip.Popup className="tooltip-popup">
							<BaseTooltip.Arrow className="tooltip-arrow" />
							{content}
						</BaseTooltip.Popup>
					</BaseTooltip.Positioner>
				</BaseTooltip.Portal>
			</BaseTooltip.Root>
		</BaseTooltip.Provider>
	);
}
