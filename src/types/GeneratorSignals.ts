import * as Tone from "tone";
import { PatternName } from "tone/build/esm/event/PatternGenerator";

export type EventSequence<E> = {
  startOffsetSeconds?: number;
  // endOffsetSeconds: string;
  loop?: boolean | number;
  loopEnd?: string;
  loopStart?: string;
  events: EventValueType<E>[];
};

export type LooppingEventsOptions<E> = {
  pattern: PatternName;
  interval: number;
  humanize?: boolean | number;
  probability?: Tone.Unit.NormalRange;
  values: LoopEventValue<E>[];
};

export type LoopEventValue<S> = {
  rampTime: number;
  signal: RequireAtLeastOne<S>;
  // signal: Partial<S>
};

export type EventValueType<S> = {
  time: Tone.Unit.Time;
} & LoopEventValue<S>;

export type SignalBase = {
  gain: Tone.Unit.GainFactor;
};

export type FilterSignalOptions = {
  wet: number;
  frequency: Tone.Unit.Frequency;
  Q: number;
  gain: number;
  detune: number;
};

export type SpinPannerEffectSignals = {
  wet: 0 | 1;
  frequency: number;
};

export type BinauralBeatSynthSignals = {
  baseFreq: Tone.Unit.Frequency;
  beatFreq: Tone.Unit.Frequency;
};

type Panner3DPositionSignals = {
  positionX: number; // horizontal axis
  positionY: number; // vertical axis
  positionZ: number; // depth axis
};

type PitchShiftSignals = {
  wet: 0 | 1;
  pitch: number;
};

export type BinauralBeatEventSignal = {
  synth: RequireAtLeastOne<BinauralBeatSynthSignals>;
} & SignalBase;

export type BinauralBeatSpinEventSignal = {
  synth: RequireAtLeastOne<BinauralBeatSynthSignals>;
  spinEffect: RequireAtLeastOne<SpinPannerEffectSignals> | 0 | 1;
} & SignalBase;

export type NoiseFilteredGenEventSignal = {
  filter: RequireAtLeastOne<FilterSignalOptions>;
} & SignalBase;

export type SamplePlayerEventSignal = {
  startSample: true;
  startPattern:
    | {
        pattern: PatternName;
      }
    | true;
  panner3d: RequireAtLeastOne<Panner3DPositionSignals>;
  pitchShift: RequireAtLeastOne<PitchShiftSignals>;
} & SignalBase;
