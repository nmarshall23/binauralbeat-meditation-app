import * as Tone from "tone";

import { BasicBinauralBeatOscOptions } from "../SoundGenerators";
import { PlaybackTriggers } from "../Types";
import { computed, reactive } from "vue";
import { useTrackToneNode } from "../../use/useTrackToneNode";

export function createBasicBinauralBeatOsc(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: BasicBinauralBeatOscOptions
) {
  const { gain, beatFreq, osc: oscOptions } = options;

  console.debug(
    `createBasicNoiseGen ${generatorName} gain %o, opt %o`,
    gain,
    options
  );

  const channel = new Tone.Channel(-16);

  const channelGainNode = channel.send("main");

  const envNode = new Tone.AmplitudeEnvelope({
    attack: 4,
    decay: 0,
    sustain: 0.5,
    release: 4,
    attackCurve: "sine",
    releaseCurve: "sine",
  }).connect(channel);

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

  const signalFreq = new Tone.Signal({
    value: oscOptions.frequency,
    units: "frequency",
  }).connect(oscGenR.frequency);

  const add = new Tone.Add(beatFreq).connect(oscGenL.frequency);

  signalFreq.connect(add);

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
    oscGenR.start("+4");
    oscGenL.start("+4");

    envNode.triggerRelease("+0.1");
  });

  /* === Controls === */

  const muteCtrl = useTrackToneNode(channel, "mute", false);
  const gainCtrl = computed({
    get: () => channelGainNode.gain.value,
    set: (value) => channelGainNode.gain.rampTo(value, '+0.5')
  })

  const volumeCtrl = computed({
    get: () => channel.volume.value,
    set: (value) => channel.volume.rampTo(value, "+0.5"),
  });

  function dispose() {
    channel.dispose()
  }

  return reactive({
    generatorName,
    muteCtrl,
    gainCtrl,
    volumeCtrl,
    dispose,
  });
}
