import * as Tone from "tone";

import { isMatching } from "ts-pattern";
import { useTrackToneNode } from "@/use/useTrackToneNode";
import { useVolumeControl } from "@/use/useVolumeControl";
import { BinauralBeatSynthSpinGenerator } from "@/types/GeneratorDef";
import { GeneratorCtrlBinauralBeatSpin } from "@/types/GeneratorControls";
import { PlaybackTriggers } from "@/types/PlaybackState";
import {
  eventMatcherBinauralBeatFreq,
  eventMatcherGain,
  eventMatcherOscFreq,
  eventMatcherSpinCycleFreq,
  eventMatcherSpinEffect,
  eventMatcherSpinEffectWet,
} from "@/use/useLoopEventMatchers";
import { setupLoopEventsHandlers } from "@/use/setupLoopEventsHandlers";
import { BinauralBeatSynth } from "../Instrument/BinauralBeatSynth";
import { SpinningPanner } from "../effect/spinningPanner";
import {
  BinauralBeatSpinEventSignal,
  EventValueType,
} from "@/types/GeneratorSignals";
import { setupEventSequenceHandlers } from "@/use/setupEventSequenceHandlers";
import { noop } from "@vueuse/core";

export function createBinauralBeatSpinOsc(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: BinauralBeatSynthSpinGenerator
): GeneratorCtrlBinauralBeatSpin {
  const { gain, synth, spinPanner, loopEvents, eventSequence } = options;

  console.debug(
    `createBinauralBeatSpinOsc ${generatorName} gain %o, opt %o`,
    gain,
    toRaw(options)
  );

  const channel = new Tone.Channel();

  const gainNode = new Tone.Gain(gain);

  const spinEffectNode = new SpinningPanner(spinPanner);

  const beatSynth = new BinauralBeatSynth(synth);

  // === Connections === //
  channel.send("main");
  beatSynth.chain(spinEffectNode, gainNode, channel);

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

  function eventCallback(
    eventType: string,
    time: number,
    event: EventValueType<BinauralBeatSpinEventSignal>
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

    if (isMatching(eventMatcherSpinEffect, event)) {
      const { rampTime, signal } = event;
      spinEffectNode.wet.rampTo(signal.spinEffect, rampTime, time);
    }

    if (isMatching(eventMatcherSpinEffectWet, event)) {
      const { rampTime, signal } = event;
      spinEffectNode.wet.rampTo(signal.spinEffect.wet, rampTime, time);
    }

    if (isMatching(eventMatcherSpinCycleFreq, event)) {
      const { rampTime, signal } = event;
      spinEffectNode.frequency.rampTo(
        signal.spinEffect.frequency,
        rampTime,
        time
      );
    }
  }

  const { disposePattern } = setupLoopEventsHandlers(
    eventHandler,
    loopEvents,
    (time, event) =>
      eventCallback(
        "Loop Event",
        time,
        event as EventValueType<BinauralBeatSpinEventSignal>
      )
  );

  const disposePart = setupEventSequenceHandlers(
    eventHandler,
    eventSequence,
    (time: number, event) =>
      eventCallback(
        "Event Sequence",
        time,
        event as EventValueType<BinauralBeatSpinEventSignal>
      )
  );

  /* === Dispay === */

  const displayName = computed(() => {
    return `${generatorName} - ${beatSynth.beatFrequency.value}Hz`;
  });

  /* === Controls === */

  const muteCtrl = useTrackToneNode(channel, "mute", false);

  const { volumeRef } = useVolumeControl(channel.volume);

  function dispose() {
    channel.dispose();
    disposePart();
    disposePattern();
  }

  return reactive({
    generatorName: displayName,
    type: "BinauralBeatSpinOsc",
    generatorDef: {
      type: "BinauralBeatSpinOsc",
      options
    },
    muteCtrl,
    volumeCtrl: volumeRef,
    dispose,
    hasOptions: false,
    updateOptions: noop,
    getOptionValues: () => {},
    toggleGenSoundTest: (_value?: boolean) => {},
    additionalRecords: null
  });
}
