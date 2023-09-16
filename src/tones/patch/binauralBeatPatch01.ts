import * as Tone from "tone";
import { FilterEffect } from "../effect/filterEffect";
import { BinauralBeatEffect } from "../effect/binauralBeatEffect";
import {
  useTrackPramNode,
  useTrackToneField,
  useTrackToneNode,
  useTrackToneNodeSignal,
} from "@/use/useTrackToneNode";
import { useToneConnectEffect } from "@/use/useToneConnectEffect";

export function binauralBeatPatch01() {
  // === Delare ToneNodes === //
  const channel = new Tone.Channel();

  channel.send("main");

  const finalGainNode = new Tone.Gain(1);

  const synth01GainNode = new Tone.Gain(0.5);

  const synth01Node = new Tone.FMSynth({
    oscillator: {
      type: "sawtooth",
    },
  });

  const synth02GainNode = new Tone.Gain(0);

  const synth02Node = new Tone.Synth({
    oscillator: {
      type: "sine",
    },
  });

  const filterNode = new FilterEffect({
    filter: {
      type: "lowpass",
      frequency: 400,
    },
  });

  const binauralBeatNode = new BinauralBeatEffect();

  const lfoNode = new Tone.LFO().sync().start(0);

  // === Wire ToneNodes === //

  finalGainNode.chain(filterNode, channel);

  synth01Node.chain(synth01GainNode, binauralBeatNode, finalGainNode);
  synth02Node.chain(synth02GainNode, binauralBeatNode, finalGainNode);

  // === Wire filterNode.frequency to lfoNode === //

  const {
    signal: filterFrequencySignal,
    effectAmountRef: filterLFOamountRef,
    dispose: filterFrequencyDispose,
  } = useToneConnectEffect(lfoNode, filterNode.frequency);

  // const {
  //   signal: filterFrequencySignal,
  //   effectAmountRef: synth01FreqToFilterFreq,
  //   effectScaleFac,
  //   // dispose: filterFrequencyDispose
  // } = useToneConnectEffect(synth01Node.frequency, filterFrequencyPSignal, {
  //   modulatorInline: false,
  // });

  // synth01FreqToFilterFreq.value = 0
  // effectScaleFac.value = 0.5
  const synFreqFactor = new Tone.Multiply(2)
  synth01Node.frequency.chain(synFreqFactor, filterNode.frequency)

   const filterNodeSignalFreq = useTrackToneNodeSignal(
    filterFrequencySignal,
    0.1,
    (n: number) => filterNode.toFrequency(n),
    (n) => filterNode.toFrequency(n)
  );

  // === Wire  to lfoNode === //

  const {
    signalRef: synth02DetuneSignal,
    effectAmountRef: synth02DetuneLfoAmount,
    dispose: synth02DetuneDispose,
  } = useToneConnectEffect(lfoNode, synth02Node.detune);

  // === Control Refs === //

  const synth01NodeGain = useTrackPramNode(synth01GainNode.gain);

  const synth01NodeOscBaseType = useTrackToneNode(
    synth01Node.oscillator,
    "baseType",
    "sine"
  );

  const synth01NodeOscSourceType = useTrackToneNode(
    synth01Node.oscillator,
    "sourceType",
    "oscillator"
  );

  const synth01NodeModulationIndex = useTrackToneNodeSignal(
    synth01Node.modulationIndex
  );

  const synth01NodeHarmonicityFactor = useTrackPramNode(
    synth01Node.harmonicity.factor
  );

  const synth01NodeOscModulationType = useTrackToneNode(
    synth01Node.oscillator,
    "modulationType",
    "square"
  ) as Ref<OscillatorType>

  const synth01NodeOscModulationIndex = useTrackToneField(
    synth01Node.oscillator, 'modulationIndex'
  ) as Ref<number>

  const synth01NodeOscHarmonicity = useTrackToneField(
    synth01Node.oscillator, 'harmonicity'
  ) as Ref<number>

  const synth01NodeOscSpread = useTrackToneNode(
    synth01Node.oscillator, 'spread', 20
  ) 

  // === Synth 02 === //

  const synth02NodeOscBaseType = useTrackToneNode(
    synth02Node.oscillator,
    "baseType",
    "sine"
  );

  const synth02NodeOscSourceType = useTrackToneNode(
    synth02Node.oscillator,
    "sourceType",
    "oscillator"
  );

  const synth02NodeGain = useTrackPramNode(synth02GainNode.gain);

  const filterNodeSignalWet = useTrackToneNodeSignal(filterNode.wet);

 

  // const filterLFOamountSignal = useTrackToneNodeSignal(filterLfoAmount.fade);

  const lfoNodeType = useTrackToneNode(lfoNode, "type", "sine");

  const lfoNodeFreq = useTrackToneNodeSignal(
    lfoNode.frequency,
    0.1,
    (n: number) => filterNode.toFrequency(n),
    (n) => filterNode.toFrequency(n)
  );

  function triggerAttack(note: Tone.Unit.Frequency, time?: Tone.Unit.Time) {
    synth01Node.triggerAttack(note, time);
    synth02Node.triggerAttack(note, time);
  }

  function triggerRelease(time?: Tone.Unit.Time) {
    synth01Node.triggerRelease(time);
    synth02Node.triggerRelease(time);
  }

  function dispose() {
    synth01Node.dispose();
    synth02Node.dispose();
    synth02DetuneDispose();
    filterFrequencyDispose();
  }

  return {
    synth01Node,
    synth02Node,
    filterNode,
    lfoNode,

    dispose,
    triggerAttack,
    triggerRelease,
    synth01NodeOscBaseType,
    synth01NodeOscSourceType,
    synth01NodeGain,
    synth01NodeModulationIndex,
    synth01NodeHarmonicityFactor,
    synth01NodeOscSpread,

    synth01NodeOscModulationType,
    synth01NodeOscModulationIndex,
    synth01NodeOscHarmonicity,

    synth02NodeOscBaseType,
    synth02NodeOscSourceType,
    synth02NodeGain,
    filterNodeSignalWet,
    filterNodeSignalFreq,
    filterLFOamountRef,
    lfoNodeFreq,
    lfoNodeType,

    synth02DetuneSignal,
    synth02DetuneLfoAmount,
  };
}


