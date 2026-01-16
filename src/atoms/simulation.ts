import { Atom } from "@effect-atom/atom-react";
import { DEFAULT_ORBIT_TYPE } from "../physics/index.ts";

// Effect Atoms: reactive state that auto-updates components
// Usage: const [value, setValue] = useAtom(atom) or useAtomValue(atom)

export const isPlayingAtom = Atom.make<boolean>(true); // Play/pause state

export const timeScaleAtom = Atom.make<number>(500); // Speed multiplier (1x = real-time)

export const orbitalAngleAtom = Atom.make<number>(0); // Satellite position (0 to 2π radians)

export const elapsedTimeAtom = Atom.make<number>(0); // Simulation time in seconds

export const orbitTypeAtom = Atom.make<string>(DEFAULT_ORBIT_TYPE); // Selected orbit ID
