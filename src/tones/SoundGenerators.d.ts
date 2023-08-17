import * as Tone from "tone";
import { PatternName } from "tone/build/esm/event/PatternGenerator";

export type SoundGeneratorBasicNoiseGenOptions = {
  gain: Tone.Unit.GainFactor;
  noise: {
    type: Tone.NoiseType;
  };
};

export type SoundGeneratorBasicNoiseGen = {
  type: "BasicNoiseGen";
  options: SoundGeneratorBasicNoiseGenOptions;
};

export type BasicBinauarlBeatOscOptions = {
  gain: Tone.Unit.GainFactor;
  beatFreq: number;
  osc: {
    frequency: Tone.Unit.Frequency;
    phase?: Tone.Unit.Degrees;
  };
};

export type SoundGeneratorBasicBinauarlBeatOsc = {
  type: "BasicBinauarlBeatOsc";
  options: BasicBinauarlBeatOscOptions;
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
    gain?: number
  };
};

export type SoundGeneratorNoiseFilteredGen = {
  type: "NoiseFilteredGen";
  options: NoiseFilteredGenOptions;
};



export type LooppingEventsOptions<E> = {
  pattern: PatternName;
  interval: number;
  humanize?: boolean | number;
  probability: Tone.Unit.NormalRange;
  values: LoopEventValue<E>[];
};

export interface AdvBinauarlBeatOscOptions {
  gain: Tone.Unit.GainFactor;
  beatFreq: Tone.Unit.Hertz;
  osc: {
    frequency: Tone.Unit.Hertz;
    phase?: Tone.Unit.Degrees;
  };
  loopEvents?: LooppingEventsOptions<BinauarlBeatOscLoopEventSignal>;
};

export type SoundGeneratorAdvBinauarlBeatOsc = {
  type: "AdvBinauarlBeatOsc";
  options: AdvBinauarlBeatOscOptions;
};


export type BinauralBeatSpinOscOptions = {
  gain: Tone.Unit.GainFactor;
  beatFreq: Tone.Unit.Hertz;
  spinCrossFade: number
  spinCycle: number
  osc: {
    frequency: Tone.Unit.Hertz;
    phase?: Tone.Unit.Degrees;
  };
  loopEvents?: LooppingEventsOptions<BinauralBeatSpinEventSignal>;
};

export type BinauralBeatSpinOsc = {
  type: "BinauralBeatSpinOsc";
  options: BinauralBeatSpinOscOptions;
};

/// LoopEventValue<RequireAtLeastOne<BinauarlBeatOscLoopEventSignal>>

export interface LoopEventValue<S> {
  rampTime: number;
  signal: Partial<S>;
};

export type BinauarlBeatOscLoopEvent = {
  rampTime: number;
  signal: Partial<BinauarlBeatOscLoopEventSignal>;
};

type BinauarlBeatOscLoopEventSignal = {
  beatFreq: Tone.Unit.Hertz;
  frequency: Tone.Unit.Hertz;
  gain: Tone.Unit.GainFactor;
};

type BinauralBeatSpinEventSignal = {
  beatFreq: Tone.Unit.Hertz;
  frequency: Tone.Unit.Hertz;
  gain: Tone.Unit.GainFactor;
  spinCrossFade: number
  spinCycle: number
};

export type SoundGenerators =
  | SoundGeneratorBasicNoiseGen
  | SoundGeneratorBasicBinauarlBeatOsc
  | SoundGeneratorNoiseFilteredGen
  | SoundGeneratorAdvBinauarlBeatOsc
  | BinauralBeatSpinOsc
