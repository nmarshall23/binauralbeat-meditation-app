import * as Tone from "tone";
import { useTrackToneNode } from "@/use/useTrackToneNode";
import { BasicBinauralBeatOscOptions } from "@/types/GeneratorDef";
import { GeneratorControls } from "@/types/GeneratorControls";
import { PlaybackTriggers } from "@/types/PlaybackState";
import { useVolumeControl } from "@/use/useVolumeControl";

export function createBasicBinauralBeatOsc(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: BasicBinauralBeatOscOptions
): GeneratorControls {
  const { gain, beatFreq, osc: oscOptions } = options;

  console.debug(
    `createBasicNoiseGen ${generatorName} gain %o, opt %o`,
    gain,
    toRaw(options)
  );

  const channel = new Tone.Channel();

  const gainNode = new Tone.Gain(gain);

  const envNode = new Tone.AmplitudeEnvelope({
    attack: 6,
    decay: 0,
    sustain: 1,
    release: 4,
    attackCurve: "cosine",
    releaseCurve: "linear",
  });

  const merge = new Tone.Merge();

  const oscGenR = new Tone.OmniOscillator({
    type: "sine",
    ...oscOptions,
  });

  const oscGenL = new Tone.OmniOscillator({
    type: "sine",
    ...oscOptions,
  });

  // === Connections === //
  channel.send("main");
  merge.chain(envNode, gainNode, channel);
  oscGenL.connect(merge, 0, 1).sync();
  oscGenR.connect(merge, 0, 0).sync();

  // === Signals === //

  const freqSignal = new Tone.Signal({
    value: oscOptions.frequency,
    units: "frequency",
  }).connect(oscGenR.frequency);

  const add = new Tone.Add(beatFreq).connect(oscGenL.frequency);

  freqSignal.connect(add);

  // === Playback === //

  eventHandler.onPlayBackStarted((event) => {
    const seconds = oscGenL.toSeconds(event.time);
    envNode.triggerAttack(seconds);
    oscGenL.start(seconds);
    oscGenR.start(seconds);
  });

  eventHandler.onPlayBackPaused((time) => {
    const seconds = oscGenL.toSeconds(time);
    envNode.triggerRelease(seconds);
    const stopSeconds = seconds + envNode.toSeconds(envNode.release)
    oscGenL.stop(stopSeconds);
    oscGenR.stop(stopSeconds);
  });

  eventHandler.onPlayBackStopped((time) => {
    const seconds = oscGenL.toSeconds(time);
    envNode.triggerRelease(seconds);
    const stopSeconds = seconds + envNode.toSeconds(envNode.release)
    oscGenL.stop(stopSeconds);
    oscGenR.stop(stopSeconds);
  });

  /* === Controls === */

  const muteCtrl = useTrackToneNode(channel, "mute", false);

  const { volumeRef } = useVolumeControl(channel.volume);

  function dispose() {
    channel.dispose();
  }

  return reactive({
    generatorName,
    type: "BasicBinauralBeatOsc",
    muteCtrl,

    volumeCtrl: volumeRef,
    dispose,
  });
}
