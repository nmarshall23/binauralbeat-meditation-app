import * as Tone from "tone";
import { NoiseFilteredGenOptions } from "@/types/GeneratorDef";
import { capitalCase } from "change-case";
import { useVolumeControl } from "@/use/useVolumeControl";
import { useTrackToneNode } from "@/use/useTrackToneNode";
import { GeneratorControls } from "@/types/GeneratorControls";
import { PlaybackTriggers } from "@/types/PlaybackState";
import { isMatching } from "ts-pattern";
import {
  eventMatcherFilterDetune,
  eventMatcherFilterFrequency,
  eventMatcherFilterGain,
  eventMatcherFilterQ,
  eventMatcherGain,
} from "@/use/useLoopEventMatchers";

import { setupLoopEventsHandlers } from "@/use/setupLoopEventsHandlers";

export function createNoiseFilteredGen(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: NoiseFilteredGenOptions
): GeneratorControls {
  const {
    gain = 1,
    noise: noiseOptions,
    filter: filterOptions,
    loopEvents,
  } = options;

  console.debug(
    `createNoiseFilteredGen ${generatorName} gain %o, opt %o`,
    gain,
    options
  );

  const channel = new Tone.Channel(0);

  const channelGainNode = channel.send("main");

  // channelGainNode.set({ gain })

  console.debug(
    `createNoiseFilteredGen ${generatorName} channelGainNode %o`,
    channelGainNode.gain.value
  );

  const gainNode = new Tone.Gain(gain).connect(channel);

  const filterNode = new Tone.Filter(filterOptions).connect(gainNode);

  const envNode = new Tone.AmplitudeEnvelope({
    attack: 5,
    decay: 0,
    sustain: 0.5,
    release: 10,
    attackCurve: "linear",
    releaseCurve: "linear",
  }).connect(filterNode);

  const noiseNode = new Tone.Noise(noiseOptions).connect(envNode);

  /* === === */

  //   const gainSignal = new Tone.Signal({
  //     value: gain,
  //     units: ''
  //   })

  /* === === */

  eventHandler.onPlayBackStarted(() => {
    if (noiseNode.state === "stopped") {
      noiseNode.start("+0.1");
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
    // noiseNode.stop("+20");

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

    if (isMatching(eventMatcherFilterFrequency, event)) {
      const { rampTime, signal } = event;
      filterNode.frequency.rampTo(signal.filter.frequency, rampTime, "+0.1");
    }

    if (isMatching(eventMatcherFilterQ, event)) {
      const { rampTime, signal } = event;
      filterNode.Q.rampTo(signal.filter.Q, rampTime, "+0.1");
    }

    if (isMatching(eventMatcherFilterGain, event)) {
      const { rampTime, signal } = event;
      filterNode.gain.rampTo(signal.filter.gain, rampTime, "+0.1");
    }

    if (isMatching(eventMatcherFilterDetune, event)) {
      const { rampTime, signal } = event;
      filterNode.detune.rampTo(signal.filter.detune, rampTime, "+0.1");
    }
  });

  /* === Dispay === */

  const displayName = computed(() => {
    return `${generatorName} - ${capitalCase(noiseNode.type)}`;
  });

  /* === Controls === */

  const muteCtrl = useTrackToneNode(channel, "mute", false);
  const gainCtrl = computed({
    get: () => channelGainNode.gain.value,
    set: (value) => channelGainNode.gain.rampTo(value, "+0.5"),
  });

  const { volumeRef } = useVolumeControl(channel.volume);

  function dispose() {
    channel.dispose();
  }

  return reactive({
    generatorName: displayName,
    type: "NoiseFilteredGen",
    muteCtrl,
    gainCtrl,
    volumeCtrl: volumeRef,
    dispose,
  });
}
