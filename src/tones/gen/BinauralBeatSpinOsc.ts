import * as Tone from "tone";

import { isMatching } from "ts-pattern";
import { useTrackToneNode } from "@/use/useTrackToneNode";
import { useVolumeControl } from "@/use/useVolumeControl";
import { BinauralBeatSpinOscOptions } from "@/types/GeneratorDef";
import { GeneratorControls } from "@/types/GeneratorControls";
import { PlaybackTriggers } from "@/types/PlaybackState";
import {
  eventMatcherBinauralBeatFreq,
  eventMatcherGain,
  eventMatcherOscFreq,
  eventMatcherSpinCycleFreq,
  eventMatcherSpinEffect,
} from "@/use/useLoopEventMatchers";
import { setupLoopEventsHandlers } from "@/use/setupLoopEventsHandlers";
import { BinauralBeatSynth } from "./source/BinauralBeatSynth";
import { SpinningPanner } from "../effect/spinningPanner";

export function createBinauralBeatSpinOsc(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: BinauralBeatSpinOscOptions
): GeneratorControls {
  const {
    gain,
    beatFreq,
    spinEffect = 1,
    spinCycleFreq = 0.5,
    osc: oscOptions,
    loopEvents,
  } = options;

  console.debug(
    `createBinauralBeatSpinOsc ${generatorName} gain %o, opt %o`,
    gain,
    toRaw(options)
  );

  const channel = new Tone.Channel();

  const gainNode = new Tone.Gain(gain);

  const spinEffectNode = new SpinningPanner({
    wet: spinEffect,
    frequency: spinCycleFreq,
  });

  const beatSynth = new BinauralBeatSynth({
    baseFrequency: oscOptions.frequency,
    beatFrequency: beatFreq,
  });

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

  setupLoopEventsHandlers(eventHandler, loopEvents, (time, event) => {
    console.log(
      "%o Pattern Triggered - Time %o, event.rampTime: %o event.signal %o",
      generatorName,
      Math.floor(time),
      event?.rampTime,
      toRaw(event?.signal)
    );

    if (isMatching(eventMatcherGain, event)) {
      const { rampTime, signal } = event;
      gainNode.gain.rampTo(signal.gain, rampTime, "+0.1");
    }

    if (isMatching(eventMatcherBinauralBeatFreq, event)) {
      const { rampTime, signal } = event;
      beatSynth.beatFrequency.rampTo(signal.beatFreq, rampTime, "+0.1");
    }

    if (isMatching(eventMatcherOscFreq, event)) {
      const { rampTime, signal } = event;
      beatSynth.baseFrequency.rampTo(signal.osc.frequency, rampTime, "+0.1");
    }

    if (isMatching(eventMatcherSpinEffect, event)) {
      const { rampTime, signal } = event;
      spinEffectNode.wet.rampTo(signal.spinEffect, rampTime, "+0.1");
    }

    if (isMatching(eventMatcherSpinCycleFreq, event)) {
      const { rampTime, signal } = event;
      spinEffectNode.frequency.rampTo(signal.spinCycleFreq, rampTime, time);
    }
  });

  /* === Dispay === */

  const displayName = computed(() => {
    return `${generatorName} - ${beatFreq}Hz`;
  });

  /* === Controls === */

  const muteCtrl = useTrackToneNode(channel, "mute", false);

  const { volumeRef } = useVolumeControl(channel.volume);

  function dispose() {
    channel.dispose();
  }

  return reactive({
    generatorName: displayName,
    type: "BinauralBeatSpinOsc",
    muteCtrl,
    volumeCtrl: volumeRef,
    dispose,
  });
}
