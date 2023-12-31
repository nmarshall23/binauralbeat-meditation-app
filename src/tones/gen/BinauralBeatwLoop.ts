import * as Tone from "tone";

import { BinauralBeatSynthGenerator } from "@/types/GeneratorDef";
import { useTrackToneNode } from "@/use/useTrackToneNode";
import { isMatching } from "ts-pattern";
import { useVolumeControl } from "@/use/useVolumeControl";
import {
  BinauralBeatSynthAdditionalRecords,
  GeneratorCtrlBinauralBeatSynth,
  GeneratorCtrlBinauralBeatSynthOptions,
  OscillatorSourceType,
} from "@/types/GeneratorControls";
import { PlaybackTriggers } from "@/types/PlaybackState";
import {
  eventMatcherBinauralBeatFreq,
  eventMatcherGain,
  eventMatcherOscFreq,
} from "@/use/useLoopEventMatchers";
import { setupLoopEventsHandlers } from "@/use/setupLoopEventsHandlers";
import { BinauralBeatSynth } from "../Instrument/BinauralBeatSynth";
import { setupEventSequenceHandlers } from "@/use/setupEventSequenceHandlers";
import {
  BinauralBeatEventSignal,
  EventValueType,
} from "@/types/GeneratorSignals";
import { logicNot } from "@vueuse/math";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";
// import { FilterEffect } from "../effect/filterEffect";

const defaultVolume = 0;

export function createBinauralBeatwLoop(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: BinauralBeatSynthGenerator
): GeneratorCtrlBinauralBeatSynth {
  const { gain, synth, loopEvents, eventSequence } = options;

  console.debug(
    `createBinauralBeatwLoop ${generatorName} gain %o, opt %o`,
    gain,
    toRaw(options)
  );

  const channel = new Tone.Channel(defaultVolume);

  const gainNode = new Tone.Gain(gain);

  // const distortionNode = new Tone.Distortion()
  // const chebyNode = new Tone.Chebyshev(20)

  // const filterEffectNode = new FilterEffect({
  //   filter,
  //   wet: filter?.wet ?? 0,
  //   filterFrequencyIndex: filter?.filterFrequencyIndex
  // });

  // filterEffectNode.filter.frequency.value = 120

  const beatSynth = new BinauralBeatSynth(synth);

  // === Connections === //
  channel.send("main");
  beatSynth.chain(gainNode, channel);

  // === Signals === //

  // beatSynth.baseFrequency.connect(filterEffectNode.filterFrequencyIndex)

  // === Playback === //

  eventHandler.onPlayBackStarted((event) => {
    beatSynth.triggerAttack(event.time);
  });

  eventHandler.onPlayBackPaused((time) => {
    beatSynth.triggerRelease(time);
  });

  eventHandler.onPlayBackStopped((time) => {
    beatSynth.triggerRelease(time);
  });

  function callback(
    eventType: string,
    time: number,
    event: EventValueType<BinauralBeatEventSignal>
  ) {
    console.log(
      "%o %o Triggered - Time %o, event.rampTime: %o event.signal %o",
      eventType,
      generatorName,
      Math.floor(time),
      event?.rampTime,
      toRaw(event?.signal)
    );

    if (isMatching(eventMatcherGain, event)) {
      const { rampTime, signal } = event;
      gainNode.gain.rampTo(signal.gain, rampTime, time);
    }

    if (isMatching(eventMatcherBinauralBeatFreq, event)) {
      const { rampTime, signal } = event;
      beatSynth.beatFrequency.rampTo(signal.synth.beatFreq, rampTime, time);
    }

    if (isMatching(eventMatcherOscFreq, event)) {
      const { rampTime, signal } = event;
      beatSynth.baseFrequency.rampTo(signal.synth.baseFreq, rampTime, time);
    }
  }

  const { disposePattern } = setupLoopEventsHandlers(
    eventHandler,
    loopEvents,
    (time, event) =>
      callback(
        "Loop Event",
        time,
        event as EventValueType<BinauralBeatEventSignal>
      )
  );

  const disposePart = setupEventSequenceHandlers(
    eventHandler,
    eventSequence,
    (time: number, event) =>
      callback(
        "Event Sequence",
        time,
        event as EventValueType<BinauralBeatEventSignal>
      )
  );

  /* === Dispay === */

  const displayName = computed(() => {
    return `${generatorName} - ${beatSynth.beatFrequency.value}Hz`;
  });

  /* === Controls === */

  const muteCtrl = useTrackToneNode(channel, "mute", false);

  const { volumeRef } = useVolumeControl(channel.volume);

  /* === Options === */

  function getOptionValues() {
    return {
      synth: {
        baseFrequency: beatSynth.baseFrequency.value,
        beatFrequency: beatSynth.beatFrequency.value,
        oscillator: {
          baseType: beatSynth.oscillatorBaseType as OscillatorType,
          sourceType: beatSynth.oscillatorSourceType as OscillatorSourceType,
          partialCount: beatSynth.oscillatorPartialCount,
          sourceOptions: {
            count: beatSynth.oscillatorCount ?? 3,
            spread: beatSynth.oscillatorSpread ?? 20,
            modulationType:
              beatSynth.oscillatorModulationType ?? ("square" as const),
            harmonicity: beatSynth.oscillatorHarmonicity ?? 1,
            modulationIndex: beatSynth.oscillatorModulationIndex,
          },
        },
      },
    };
  }

  function updateOptions(
    options: RecursivePartial<GeneratorCtrlBinauralBeatSynthOptions>
  ) {
    console.info("updateOptions %o", toRaw(options));
    beatSynth.oscillatorBaseType =
      options.synth?.oscillator?.baseType ?? "sine";
    beatSynth.oscillatorSourceType =
      options.synth?.oscillator?.sourceType ?? "oscillator";
    beatSynth.oscillatorPartialCount =
      options.synth?.oscillator?.partialCount ?? 0;
    beatSynth.baseFrequency.rampTo(options.synth?.baseFrequency ?? 180, 1);
    beatSynth.beatFrequency.rampTo(options.synth?.beatFrequency ?? 4, 1);
    beatSynth.oscillatorHarmonicity =
      options.synth?.oscillator?.sourceOptions?.harmonicity ?? 1;
    beatSynth.oscillatorCount =
      options.synth?.oscillator?.sourceOptions?.count ?? 3;

    beatSynth.oscillatorSpread =
      options.synth?.oscillator?.sourceOptions?.spread ?? 20;
    beatSynth.oscillatorModulationType =
      options.synth?.oscillator?.sourceOptions?.modulationType ?? "square";
    beatSynth.oscillatorModulationIndex =
      options.synth?.oscillator?.sourceOptions?.modulationIndex ?? 1;

    // console.log('sourceGetAsArray %o', beatSynth.asArray().then((value) => value[2]))
  }

  const [isGenTestEnabled, toggleGenSoundTest] = useToggle();

  whenever(isGenTestEnabled, () => {
    console.debug("synth %o", getOptionValues());
    beatSynth.triggerAttack();
    // console.debug('fwet %o, ff %o bf %o',filterEffectNode.wet.value, filterEffectNode.filter.frequency.value, beatSynth.baseFrequency.value)
  });

  whenever(logicNot(isGenTestEnabled), () => {
    beatSynth.triggerRelease();
  });

  const additionalRecords: BinauralBeatSynthAdditionalRecords = {
    sourceGetAsArray: () => beatSynth.asArray(),
  }

  function dispose() {
    channel.dispose();
    disposePart();
    disposePattern();
  }

  return reactive({
    generatorName: displayName,
    type: "BinauralBeatwLoop",
    generatorDef: {
      type: "BinauralBeatwLoop",
      options
    },

    muteCtrl,
    volumeCtrl: volumeRef,
    dispose,
    hasOptions: true,
    updateOptions,
    getOptionValues,
    toggleGenSoundTest,
    additionalRecords,
  });
}
