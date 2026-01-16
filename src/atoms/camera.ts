import { Atom } from "@effect-atom/atom-react";
import type { AxisKey } from "../physics/index.ts";

export type { AxisKey };

// Camera rotation constraints: which axes are allowed to rotate
// Empty = free rotation, ["y"] = only horizontal, ["x","z"] = only vertical
export const selectedAxesAtom = Atom.make<AxisKey[]>([]);
