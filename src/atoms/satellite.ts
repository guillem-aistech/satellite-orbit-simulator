import { Atom } from "@effect-atom/atom-react";
import type { Position3D } from "../physics/index.ts";

// Satellite attitude (orientation) in radians
// Roll: rotation around forward axis (tilting left/right)
// Pitch: rotation around side axis (nose up/down)
// Yaw: rotation around vertical axis (turning left/right)

export const rollAtom = Atom.make<number>(0);
export const pitchAtom = Atom.make<number>(0);
export const yawAtom = Atom.make<number>(0);

// Satellite position in scene coordinates (updated by Satellite component)
export const satellitePositionAtom = Atom.make<Position3D>([0, 0, 0]);
