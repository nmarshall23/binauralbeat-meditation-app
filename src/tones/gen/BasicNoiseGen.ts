import * as Tone from "tone";
import { capitalCase } from "change-case";
import { useTrackToneNode } from "@/use/useTrackToneNode";
import { BasicNoiseGenOptions } from "@/types/GeneratorDef";
import { GeneratorCtrlBasicNoise } from "@/types/GeneratorControls";
import { PlaybackTriggers } from "@/types/PlaybackState";
import { noop } from "@vueuse/core";

export function createBasicNoiseGen(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: BasicNoiseGenOptions
): GeneratorCtrlBasicNoise {
  const { gain, noise: noiseOptions } = options;

  console.debug(
    `createBasicNoiseGen ${generatorName} gain %o, opt %o`,
    gain,
    options
  );

  const channel = new Tone.Channel(0);

  const channelGainNode = channel.send("main");

  const envNode = new Tone.AmplitudeEnvelope({
    attack: 5,
    decay: 0,
    sustain: 0.5,
    release: 10,
    attackCurve: "sine",
    releaseCurve: "sine",
  }).connect(channel);

  const noiseNode = new Tone.Noise(noiseOptions).connect(envNode);

  /* === Signals === */

  // === Playback === //

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

  const volumeCtrl = computed({
    get: () => channel.volume.value,
    set: (value) => channel.volume.rampTo(value, "+0.5"),
  });

  function dispose() {
    channel.dispose();
  }

  return reactive({
    generatorName: displayName,
    type: 'BasicNoiseGen',
    generatorDef: {
      type: "BasicNoiseGen",
      options
    },
    muteCtrl,
    gainCtrl,
    volumeCtrl,
    dispose,
    hasOptions: false,
    updateOptions: noop,
    getOptionValues: () => {},
    toggleGenSoundTest: (_value?: boolean) => {},
    additionalRecords: null
  });
}
