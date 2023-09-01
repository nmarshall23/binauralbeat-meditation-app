import * as Tone from "tone";

import { BinauralBeatwLoopOscOptions } from "@/types/GeneratorDef";
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
import { BinauralBeatSynth } from "./source/BinauralBeatSynth";

const defaultVolume = 0;

export function createBinauralBeatwLoop(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: BinauralBeatwLoopOscOptions
): GeneratorControls {
  const { gain, beatFreq, osc: oscOptions, loopEvents } = options;

  console.debug(
    `createBinauralBeatwLoop ${generatorName} gain %o, opt %o`,
    gain,
    toRaw(options)
  );

  const channel = new Tone.Channel(defaultVolume);

  const gainNode = new Tone.Gain(gain);

  const beatSynth = new BinauralBeatSynth({
    baseFrequency: oscOptions.frequency,
    beatFrequency: beatFreq,
  })

  // === Connections === //
  channel.send("main");
  beatSynth.chain(gainNode, channel)

  // === Signals === //



  // === Playback === //

  eventHandler.onPlayBackStarted((event) => {
    beatSynth.triggerAttack(event.time)
  });

  eventHandler.onPlayBackPaused((time) => {
    beatSynth.triggerRelease(time)

  });

  eventHandler.onPlayBackStopped((time) => {
    beatSynth.triggerRelease(time)
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
    type: "BinauralBeatwLoop",
    muteCtrl,
    volumeCtrl: volumeRef,
    dispose,
  });
}
