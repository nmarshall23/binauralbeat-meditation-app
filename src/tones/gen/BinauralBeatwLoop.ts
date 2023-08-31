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

const defaultVolume = -16;

export function createBinauralBeatwLoop(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: BinauralBeatwLoopOscOptions
): GeneratorControls {
  const { gain, beatFreq, osc: oscOptions, loopEvents } = options;

  console.debug(
    `createBinauralBeatwLoop ${generatorName} gain %o, opt %o`,
    gain,
    options
  );

  const channel = new Tone.Channel(defaultVolume);

  channel.send("main");

  const gainNode = new Tone.Gain(gain).connect(channel);

  const envNode = new Tone.AmplitudeEnvelope({
    attack: 6,
    decay: 0,
    sustain: 1,
    release: 4,
    attackCurve: "cosine",
    releaseCurve: "linear",
  }).connect(gainNode);

  const merge = new Tone.Merge().connect(envNode);

  const oscGenR = new Tone.OmniOscillator({
    type: "sine",
    ...oscOptions,
  })
    .connect(merge, 0, 0)
    .sync();

  const oscGenL = new Tone.OmniOscillator({
    type: "sine",
    ...oscOptions,
  })
    .connect(merge, 0, 1)
    .sync();

  // === Signals === //

  const freqSignal = new Tone.Signal({
    value: oscOptions.frequency,
    units: "frequency",
  }).connect(oscGenR.frequency);

  const add = new Tone.Add(beatFreq).connect(oscGenL.frequency);

  freqSignal.connect(add);

  // === Playback === //

  eventHandler.onPlayBackStarted(() => {
    if (oscGenR.state === "stopped") {
      oscGenR.start("+0.1");
      oscGenL.start("+0.1");
    }

    envNode.set({
      release: 10,
      attack: 5,
    });

    envNode.triggerAttack("+0.2");
  });

  eventHandler.onPlayBackPaused(() => {
    envNode.set({
      release: 2,
      attack: 2,
    });

    envNode.triggerRelease("+0.1");
  });

  eventHandler.onPlayBackStopped(() => {
    // oscGenR.start("+4");
    // oscGenL.start("+4");

    envNode.triggerRelease("+0.1");
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
      add.addend.rampTo(signal.beatFreq, rampTime, "+0.1");
    }

    if (isMatching(eventMatcherOscFreq, event)) {
      const { rampTime, signal } = event;
      freqSignal.rampTo(signal.osc.frequency, rampTime, "+0.1");
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
