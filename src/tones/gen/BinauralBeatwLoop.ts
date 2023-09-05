import * as Tone from "tone";

import { BinauralBeatSynthGenerator } from "@/types/GeneratorDef";
import { useTrackToneNode } from "@/use/useTrackToneNode";
import { isMatching } from "ts-pattern";
import { useVolumeControl } from "@/use/useVolumeControl";
import { GeneratorControls } from "@/types/GeneratorControls";
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
import { noop } from "@vueuse/core";

const defaultVolume = 0;

export function createBinauralBeatwLoop(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: BinauralBeatSynthGenerator
): GeneratorControls {
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
    return `${generatorName} - ${beatSynth.beatFrequency}Hz`;
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
    type: "BinauralBeatwLoop",
    muteCtrl,
    volumeCtrl: volumeRef,
    dispose,
    hasOptions: false,
    updateOptions: noop,
  });
}
