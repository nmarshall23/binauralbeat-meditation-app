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

const defaultVolume = 0;

export function createBinauralBeatSpinOsc(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: BinauralBeatSpinOscOptions
): GeneratorControls {
  const {
    gain,
    beatFreq,
    spinEffect = 1,
    spinCycleFreq = 0.25,
    osc: oscOptions,
    loopEvents,
  } = options;

  console.debug(
    `createBinauralBeatSpinOsc ${generatorName} gain %o, opt %o`,
    gain,
    options
  );

  const channel = new Tone.Channel(defaultVolume);

  channel.send("main");

  const gainNode = new Tone.Gain(gain).connect(channel);

  // const spinEffectNode = new Tone.CrossFade(spinEffect).connect(gainNode);

  // const panner3dNode = new Tone.Panner3D().connect(spinEffectNode.b)

  const spinEffectNode = new SpinningPanner({
    wet: spinEffect,
    frequency: spinCycleFreq
  }).connect(gainNode)

  const beatSynth = new BinauralBeatSynth({
    baseFrequency: oscOptions.frequency,
    beatFrequency: beatFreq,
  })
  .connect(spinEffectNode)
   // .connect(spinEffectNode.a)
   // .connect(panner3dNode)

  
  // === Panner input ===

  // const rad = Math.PI * 2
  // const lfoNode = new Tone.LFO(spinCycleFreq, -rad, rad).start();

  // lfoNode.connect(panner3dNode.orientationY)

  // === Playback === //

  eventHandler.onPlayBackStarted(() => {
    beatSynth.triggerAttack('+0.1')
  });

  eventHandler.onPlayBackPaused(() => {
    beatSynth.triggerRelease("+0.1")

  });

  eventHandler.onPlayBackStopped(() => {

    beatSynth.triggerRelease("+0.1")
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
      // lfoNode.frequency.rampTo(signal.spinCycleFreq, rampTime, time);
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


