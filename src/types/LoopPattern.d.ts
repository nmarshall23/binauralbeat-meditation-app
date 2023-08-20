
export type LooppingEventsOptions<E> = {
    pattern: PatternName;
    interval: number;
    humanize?: boolean | number;
    probability: Tone.Unit.NormalRange;
    values: LoopEventValue<E>[];
  };

  export interface LoopEventValue<S> {
    rampTime: number;
    signal: RequireAtLeastOne<S>;
  };

  
  type BinauralBeatOscLoopEventSignal = {
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