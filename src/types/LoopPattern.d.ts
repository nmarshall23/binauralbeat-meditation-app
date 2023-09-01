import * as Tone from "tone";

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
  time: Tone.Unit.Time
} & LoopEventValue<S>

export type SignalBase = {
  gain: Tone.Unit.GainFactor;
};

type FilterSignalOptions = {
  wet: number;
  frequency: Tone.Unit.Frequency;
  Q: number;
  gain: number;
  detune: number;
};

type OscillatorSignalOptions = {
  frequency: Tone.Unit.Frequency;
}

export type BinauralBeatEventSignal = {
  beatFreq: Tone.Unit.Hertz;
  osc: RequireAtLeastOne<OscillatorSignalOptions>;
} & SignalBase;


export type BinauralBeatSpinEventSignal = {
  spinEffect: 0 | 1;
  spinCycleFreq: number;
} & BinauralBeatEventSignal

export type NoiseFilteredGenEventSignal = {
  filter: RequireAtLeastOne<FilterSignalOptions>;
} & SignalBase;
