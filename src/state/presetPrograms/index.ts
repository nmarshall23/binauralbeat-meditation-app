import { MeditationProgram } from "@/types/MeditationProgram";
import {
  basic01Program,
  basicProgram,
  simpleSpinEffectProgram,
} from "./01_basic";
import { shiftingNoiseProgram, shiftingTonesProgram } from "./02_loopPatterns";
import { lpBrownProgram } from "./02_lpbrown";
import { loopingCchordSpinEffectProgram } from "./02_spinEffect";
import { mixedEffectsPragram } from "./04_fav";
import { evolve01Program } from "./04_evolving";

export const presetPrograms: MeditationProgram[] = [
  basicProgram,
  basic01Program,
  simpleSpinEffectProgram,
  loopingCchordSpinEffectProgram,
  lpBrownProgram,
  // shiftingTonesProgram,
  // shiftingNoiseProgram,
  mixedEffectsPragram,
  evolve01Program,
];
