export type LooppingEventsOptions<E> = {
  pattern: PatternName;
  interval: number;
  humanize?: boolean | number;
  probability: Tone.Unit.NormalRange;
  values: LoopEventValue<E>[];
};

export type LoopEventValue<S> = {
  rampTime: number;
  signal: RequireAtLeastOne<S>;
  // signal: Partial<S>
}

type BinauralBeatOscLoopEventSignal = {
  beatFreq: Tone.Unit.Hertz;
  frequency: Tone.Unit.Hertz;
  gain: Tone.Unit.GainFactor;
};

type BinauralBeatSpinEventSignal = {
  beatFreq: Tone.Unit.Hertz;
  frequency: Tone.Unit.Hertz;
  gain: Tone.Unit.GainFactor;
  spinCrossFade: number;
  spinCycle: number;
};

type NoiseFilteredGenEventSignal = {
  gain: Tone.Unit.GainFactor;
  filter: {
    frequency?: Tone.Unit.Frequency;
    Q?: number;
    gain?: number;
    detune?: number
  };
}