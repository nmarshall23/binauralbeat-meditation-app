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
  gain: Tone.Unit.GainFactor;
  beatFreq: Tone.Unit.Hertz;
  osc: {
    frequency?: Tone.Unit.Frequency;
  }
};

type BinauralBeatSpinEventSignal = {
  gain: Tone.Unit.GainFactor;
  beatFreq: Tone.Unit.Hertz;
  osc: {
    frequency?: Tone.Unit.Frequency;
  }
  spinEffect: 0 | 1;
  spinCycleFreq: number;
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