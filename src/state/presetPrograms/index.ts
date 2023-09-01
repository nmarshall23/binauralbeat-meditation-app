import { BinauralBeatProgram } from "../bbPrograms";
import { basicProgram, shiftingTonesProgram } from "./01_basic";
import { lpBrownProgram } from "./02_lpbrown";
import { evolvingSpinEffectProgram, simpleSpinEffectProgram } from "./03_spinEffect";
import { mixedEffectsPragram } from "./04_fav";

export const presetPrograms: BinauralBeatProgram[] = [
  basicProgram,
  shiftingTonesProgram,
  lpBrownProgram,
  simpleSpinEffectProgram,
  mixedEffectsPragram,
  evolvingSpinEffectProgram,
];
