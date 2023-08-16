import * as Tone from "tone";
import { PlaybackTriggers } from "../Types";
import { NoiseFilteredGenOptions } from "../SoundGenerators";
import { useTrackToneNode } from "../../use/useTrackToneNode";
import { computed, reactive } from "vue";
import { capitalCase } from "change-case";
import { useVolumeControl } from "../../use/useVolumeControl";

export function createNoiseFilteredGen(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: NoiseFilteredGenOptions
) {
  const { gain, noise: noiseOptions, filter: filterOptions } = options;

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

  const filter = new Tone.Filter(filterOptions).connect(channel);

  const envNode = new Tone.AmplitudeEnvelope({
    attack: 5,
    decay: 0,
    sustain: 0.5,
    release: 10,
    attackCurve: "sine",
    releaseCurve: "sine",
  }).connect(filter);

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
    noiseNode.stop("+20");

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

 
  const { volumeRef } = useVolumeControl(channel.volume, { defaultValue: gain })

  return reactive({
    generatorName: displayName,
    muteCtrl,
    gainCtrl,
    volumeCtrl: volumeRef,
  });
}
