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
  filter?: {
    type: BiquadFilterType;
    frequency: Tone.Unit.Frequency;
    Q?: number;
    gain?: number;
    detune?: number;
    wet?: 0 | 1;
  };
  loopEvents?: LooppingEventsOptions<NoiseFilteredGenEventSignal>;
  eventSequence?: EventSequence<NoiseFilteredGenEventSignal>;
};

export type BinauralBeatSynthGenerator = {
  gain: Tone.Unit.GainFactor;
  synth: Partial<Omit<BinauralBeatSynthOptions, 'context'>>;
  loopEvents?: LooppingEventsOptions<BinauralBeatEventSignal>;
  eventSequence?: EventSequence<BinauralBeatEventSignal>;
};

export type BinauralBeatSynthSpinGenerator = {
  synth: Partial<Omit<BinauralBeatSynthOptions, 'context'>>;
  gain: Tone.Unit.GainFactor;
  spinPanner?: Partial<Omit<SpinningPannerOptions, 'context'>>;
  loopEvents?: LooppingEventsOptions<BinauralBeatSpinEventSignal>;
  eventSequence?: EventSequence<BinauralBeatSpinEventSignal>;
};

export type SamplePlayerGenerator = {
  gain: Tone.Unit.GainFactor;
  player: {
    sample: SamplePlayerSampleKey;
  };
  pichShift?: {
    pich: number; // Half-step note increments, i.e. 12 is an octave above the root.
  };
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

export type SoundGeneratorDef =
  | GeneratorBasicNoiseGen
  | GeneratorBasicBinauralBeatOsc
  | GeneratorNoiseFilteredGen
  | GeneratorBinauralBeatwLoopOsc
  | GeneratorBinauralBeatSpinOsc
  | SamplePlayerGeneratorDef;


