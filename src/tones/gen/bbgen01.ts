import { isDefined } from "@vueuse/core";
import * as Tone from "tone";
import { computed, customRef, ref } from "vue";
import { useTrackToneNode } from "../../use/useTrackToneNode";

export function useBBGen01(frequency = 200, bb = 4) {
  const channel = new Tone.Channel({
    volume: -20,
    mute: false,
  });

  channel.send("main");

  const envNode = new Tone.AmplitudeEnvelope({
    attack: 4,
    decay: 0,
    sustain: 0.5,
    release: 4,
    attackCurve: "sine",
    releaseCurve: "sine",
  }).connect(channel);

  // const gainNode = new Tone.Gain(0.2).connect(envNode)
  const merge = new Tone.Merge().connect(envNode);
  // const pannerR = new Tone.Panner(1).connect()

  const oscGenR = new Tone.OmniOscillator({
    type: "sine",
    frequency,
  })
    .connect(merge, 0, 0)
    .sync();

  const oscGenL = new Tone.OmniOscillator({
    type: "sine",
    frequency,
  })
    .connect(merge, 0, 1)
    .sync();

  //=== Signals ===

  const signalFreq = new Tone.Signal({
    value: frequency,
    units: "frequency",
  }).connect(oscGenR.frequency);

  const add = new Tone.Add(bb).connect(oscGenL.frequency);

  signalFreq.connect(add);

  // const tryStartEventId = ref<number | null>(null);

  function start() {
    if (oscGenL.state === "stopped") {
      oscGenR.start("+0.1");
      oscGenL.start("+0.1");
    }

    envNode.triggerAttack("+0.2");

    envNode.set({
      release: 4,
      attack: 4,
    });
  }

  function stop() {
    oscGenR.stop("+8.1");
    oscGenL.stop("+8.1");

    envNode.triggerRelease("+0.1");
  }

  function pause() {
    envNode.set({
      release: 2.5,
      attack: 2.5,
    });

    envNode.triggerRelease("+0.1");
  }

  // const mutedCtrl = customRef((track, trigger) => {
  //   return {
  //     get() {
  //       track()
  //       return channel.mute
  //     },
  //     set(mute) {
  //       console.log("BB Mute %o channel %o", mute, channel.mute);
  //       channel.set({
  //         mute,
  //       });
  //       trigger()
  //     }
  //   }
  // })

  const muteCtrl = useTrackToneNode(channel, 'mute')

  return {
    controls: {
      start,
      stop,
      pause,
    },

    muteCtrl,

  };
}
