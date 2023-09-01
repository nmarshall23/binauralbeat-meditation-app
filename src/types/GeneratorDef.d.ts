import * as Tone from "tone";
import { PatternName } from "tone/build/esm/event/PatternGenerator";
import {
  LooppingEventsOptions,
  BinauralBeatOscLoopEventSignal,
  BinauralBeatSpinEventSignal,
  NoiseFilteredGenEventSignal,
} from "./LoopPattern";

// === Options === //

export type GeneratorDefType =
  | "BasicNoiseGen"
  | "NoiseFilteredGen"
  | "BasicBinauralBeatOsc"
  | "BinauralBeatwLoop"
  | "BinauralBeatSpinOsc";

// === Options ===

export type BasicNoiseGenOptions = {
  gain: Tone.Unit.GainFactor;
  noise: {
    type: Tone.NoiseType;
  };
};

export type BasicBinauralBeatOscOptions = {
  gain: Tone.Unit.GainFactor;
  beatFreq: number;
  osc: {
    frequency: Tone.Unit.Frequency;
    phase?: Tone.Unit.Degrees;
    detune?: number;
  };
};

export type NoiseFilteredGenOptions = {
  gain: Tone.Unit.GainFactor;
  noise: {
    type: Tone.NoiseType;
  };
  filter: {
    type: BiquadFilterType;
    frequency?: Tone.Unit.Frequency;
    Q?: number;
    gain?: number;
    detune?: number;
  };
  loopEvents?: LooppingEventsOptions<NoiseFilteredGenEventSignal>;
};

export interface BinauralBeatwLoopOscOptions {
  gain: Tone.Unit.GainFactor;
  beatFreq: Tone.Unit.Hertz;
  osc: {
    frequency: Tone.Unit.Hertz;
    phase?: Tone.Unit.Degrees;
    detune?: number;
  };
  loopEvents?: LooppingEventsOptions<BinauralBeatEventSignal>;
  eventSequence?: EventSequence<BinauralBeatEventSignal>
}

export type BinauralBeatSpinOscOptions = {
  gain: Tone.Unit.GainFactor;
  beatFreq: Tone.Unit.Hertz;
  spinEffect?: 0 | 1;
  spinCycleFreq?: number;

  osc: {
    frequency: Tone.Unit.Hertz;
    phase?: Tone.Unit.Degrees;
    detune?: number;
  };
  loopEvents?: LooppingEventsOptions<BinauralBeatSpinEventSignal>;
};

// === Generator Def ===

export type GeneratorDefBase<T extends GeneratorDefType, OptionsType> = {
  type: T;
  options: OptionsType;
};

export type GeneratorBasicNoiseGen = GeneratorDefBase<
  "BasicNoiseGen",
  BasicNoiseGenOptions
>;

export type GeneratorNoiseFilteredGen = GeneratorDefBase<
  "NoiseFilteredGen",
  NoiseFilteredGenOptions
>;

export type GeneratorBasicBinauralBeatOsc = GeneratorDefBase<
  "BasicBinauralBeatOsc",
  BasicBinauralBeatOscOptions
>;

export type GeneratorBinauralBeatwLoopOsc = GeneratorDefBase<
  "BinauralBeatwLoop",
  BinauralBeatwLoopOscOptions
>;

export type GeneratorBinauralBeatSpinOsc = GeneratorDefBase<
  "BinauralBeatSpinOsc",
  BinauralBeatSpinOscOptions
>;

export type SoundGenerators =
  | GeneratorBasicNoiseGen
  | GeneratorBasicBinauralBeatOsc
  | GeneratorNoiseFilteredGen
  | GeneratorBinauralBeatwLoopOsc
  | GeneratorBinauralBeatSpinOsc;
