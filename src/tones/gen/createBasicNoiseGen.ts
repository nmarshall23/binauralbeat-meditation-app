import * as Tone from "tone";
import { PlaybackTriggers } from "../Types";
import { SoundGeneratorBasicNoiseGenOptions } from "../SoundGenerators";
import { useTrackToneNode } from "../../use/useTrackToneNode";
import { reactive } from "vue";

export function createBasicNoiseGen(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: SoundGeneratorBasicNoiseGenOptions
) {
  const { gain, noise: noiseOptions } = options;

  console.debug(
    `createBasicNoiseGen ${generatorName} gain %o, opt %o`,
    gain,
    options
  );

  const channel = new Tone.Channel(0);

  channel.send("main");

  const envNode = new Tone.AmplitudeEnvelope({
    attack: 5,
    decay: 0,
    sustain: 0.5,
    release: 10,
    attackCurve: "sine",
    releaseCurve: "sine",
  }).connect(channel);

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

  /* === Controls === */

  const muteCtrl = useTrackToneNode(channel, "mute", false);

  return reactive({
    generatorName,
    muteCtrl,
  })
}
