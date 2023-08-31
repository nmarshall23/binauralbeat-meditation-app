import { BinauralBeatProgram } from "../bbPrograms";
import { basicProgram, shiftingTonesProgram } from "./01_basic";
import { lpBrownProgram } from "./02_lpbrown";
import { simpleSpinEffectProgram } from "./03_spinEffect";

export const presetPrograms: BinauralBeatProgram[] = [
  basicProgram,
  shiftingTonesProgram,
  lpBrownProgram,
  simpleSpinEffectProgram,
];
