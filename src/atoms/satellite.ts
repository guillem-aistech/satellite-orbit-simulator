import { Atom } from "@effect-atom/atom-react";

// Satellite attitude (orientation) in radians
// Roll: rotation around forward axis (tilting left/right)
// Pitch: rotation around side axis (nose up/down)
// Yaw: rotation around vertical axis (turning left/right)

export const rollAtom = Atom.make<number>(0);
export const pitchAtom = Atom.make<number>(0);
export const yawAtom = Atom.make<number>(0);
