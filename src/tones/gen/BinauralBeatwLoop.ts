import * as Tone from "tone";

import { BinauralBeatSynthGenerator } from "@/types/GeneratorDef";
import { useTrackToneNode } from "@/use/useTrackToneNode";
import { Pattern, isMatching } from "ts-pattern";
import { useVolumeControl } from "@/use/useVolumeControl";
import {
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

  const beatSynth = new BinauralBeatSynth(synth);

  // === Connections === //
  channel.send("main");
  beatSynth.chain(gainNode, channel);

  // === Signals === //

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
    if (
      isMatching(
        {
          synth: {
            oscillator: {
              baseType: Pattern.union("sine", "sawtooth", "square", "triangle"),
            },
          },
        },
        options
      )
    ) {
      beatSynth.oscillatorBaseType = options.synth.oscillator.baseType;
    }

    if (
      isMatching(
        {
          synth: {
            oscillator: {
              sourceType: Pattern.union("oscillator", "fat", "am", "fm"),
            },
          },
        },
        options
      )
    ) {
      beatSynth.oscillatorSourceType = options.synth.oscillator.sourceType;
    }

    if (
      isMatching(
        {
          synth: {
            oscillator: {
              partialCount: Pattern.number,
            },
          },
        },
        options
      )
    ) {
      beatSynth.oscillatorPartialCount = options.synth.oscillator.partialCount;
    }

    if (
      isMatching(
        {
          synth: {
            baseFrequency: Pattern.number,
          },
        },
        options
      )
    ) {
      beatSynth.baseFrequency.rampTo(options.synth.baseFrequency, 1);
      console.log("log");
    }

    if (
      isMatching(
        {
          synth: {
            beatFrequency: Pattern.number,
          },
        },
        options
      )
    ) {
      beatSynth.beatFrequency.rampTo(options.synth.beatFrequency, 1);
    }
  }

  const [isGenTestEnabled, toggleGenSoundTest] = useToggle();

  whenever(isGenTestEnabled, () => {
    console.debug("synth %o", getOptionValues());
    beatSynth.triggerAttack();
  });

  whenever(logicNot(isGenTestEnabled), () => {
    beatSynth.triggerRelease();
  });

  function dispose() {
    channel.dispose();
    disposePart();
    disposePattern();
  }

  return reactive({
    generatorName: displayName,
    type: "BinauralBeatwLoop",
    muteCtrl,
    volumeCtrl: volumeRef,
    dispose,
    hasOptions: true,
    updateOptions,
    getOptionValues,
    toggleGenSoundTest,

    loopEvents,
    eventSequence,
  });
}
