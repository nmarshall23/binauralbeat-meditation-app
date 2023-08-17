import * as Tone from "tone";
import { PatternName } from "tone/build/esm/event/PatternGenerator";

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
  };
};

export interface BinauralBeatwLoopOscOptions {
  gain: Tone.Unit.GainFactor;
  beatFreq: Tone.Unit.Hertz;
  osc: {
    frequency: Tone.Unit.Hertz;
    phase?: Tone.Unit.Degrees;
  };
  loopEvents?: LooppingEventsOptions<BinauralBeatOscLoopEventSignal>;
}

export type BinauralBeatSpinOscOptions = {
  gain: Tone.Unit.GainFactor;
  beatFreq: Tone.Unit.Hertz;
  spinCrossFade: number;
  spinCycle: number;
  osc: {
    frequency: Tone.Unit.Hertz;
    phase?: Tone.Unit.Degrees;
  };
  loopEvents?: LooppingEventsOptions<BinauralBeatSpinEventSignal>;
};

// === Generator Def ===

export type GeneratorBasicNoiseGen = {
  type: "BasicNoiseGen";
  options: BasicNoiseGenOptions;
};

export type GeneratorNoiseFilteredGen = {
  type: "NoiseFilteredGen";
  options: NoiseFilteredGenOptions;
};

export type GeneratorBasicBinauralBeatOsc = {
  type: "BasicBinauralBeatOsc";
  options: BasicBinauralBeatOscOptions;
};

export type GeneratorBinauralBeatwLoopOsc = {
  type: "BinauralBeatwLoop";
  options: BinauralBeatwLoopOscOptions;
};

export type GeneratorBinauralBeatSpinOsc = {
  type: "BinauralBeatSpinOsc";
  options: BinauralBeatSpinOscOptions;
};

export type SoundGenerators =
  | GeneratorBasicNoiseGen
  | GeneratorBasicBinauralBeatOsc
  | GeneratorNoiseFilteredGen
  | GeneratorBinauralBeatwLoopOsc
  | GeneratorBinauralBeatSpinOsc;
