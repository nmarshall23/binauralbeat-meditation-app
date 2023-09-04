import * as Tone from "tone";
import {
  EventSequence,
  LooppingEventsOptions,
  BinauralBeatSpinEventSignal,
  NoiseFilteredGenEventSignal,
  BinauralBeatEventSignal,
  SamplePlayerEventSignal,
} from "./GeneratorSignals";
import { BinauralBeatSynthOptions } from "@/tones/Instrument/BinauralBeatSynth";
import { SpinningPannerOptions } from "@/tones/effect/spinningPanner";
import { SamplePlayerSampleKey } from "@/tones/gen/PlayerGen";

// === Options === //

export type GeneratorDefType =
  | "BasicNoiseGen"
  | "NoiseFilteredGen"
  | "BasicBinauralBeatOsc"
  | "BinauralBeatwLoop"
  | "BinauralBeatSpinOsc"
  | "SamplePlayer";

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
  eventSequence?: EventSequence<NoiseFilteredGenEventSignal>;
};

export type BinauralBeatSynthGenerator = {
  synth: Partial<BinauralBeatSynthOptions>;
  gain: Tone.Unit.GainFactor;
  loopEvents?: LooppingEventsOptions<BinauralBeatEventSignal>;
  eventSequence?: EventSequence<BinauralBeatEventSignal>;
};

export type BinauralBeatSynthSpinGenerator = {
  synth: Partial<BinauralBeatSynthOptions>;
  gain: Tone.Unit.GainFactor;
  spinPanner?: Partial<SpinningPannerOptions>;
  loopEvents?: LooppingEventsOptions<BinauralBeatSpinEventSignal>;
  eventSequence?: EventSequence<BinauralBeatSpinEventSignal>;
};

export type SamplePlayerGenerator = {
  gain: Tone.Unit.GainFactor;
  player: {
    sample: SamplePlayerSampleKey
  };
  pichShift?: {
    pich: number // Half-step note increments, i.e. 12 is an octave above the root.
  }
  panner3d?: {
    positionX?: number; // horizontal axis
    positionY?: number; // vertical axis
    positionZ?: number; // depth axis
  };
  loopEvents?: LooppingEventsOptions<SamplePlayerEventSignal>;
  eventSequence?: EventSequence<SamplePlayerEventSignal>;
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
  BinauralBeatSynthGenerator
>;

export type GeneratorBinauralBeatSpinOsc = GeneratorDefBase<
  "BinauralBeatSpinOsc",
  BinauralBeatSynthSpinGenerator
>;

export type SamplePlayerGeneratorDef = GeneratorDefBase<
  "SamplePlayer",
  SamplePlayerGenerator
>;

export type SoundGenerators =
  | GeneratorBasicNoiseGen
  | GeneratorBasicBinauralBeatOsc
  | GeneratorNoiseFilteredGen
  | GeneratorBinauralBeatwLoopOsc
  | GeneratorBinauralBeatSpinOsc
  | SamplePlayerGeneratorDef;
