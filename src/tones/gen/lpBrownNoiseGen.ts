import * as Tone from "tone";
import { computed } from "vue";

export type NoiseGenEventType = "stop" | "start";
export interface NoiseGenEvent {
  event: NoiseGenEventType;
  time: Tone.Unit.Time;
}

export function useNoiseGen() {
  const channel = new Tone.Channel(0).send("main");

  const filter = new Tone.Filter({
    frequency: 500,
    type: "lowpass",
  }).connect(channel);

  const envNode = new Tone.AmplitudeEnvelope({
    attack: 5,
    decay: 0,
    sustain: 0.5,
    release: 10,
    attackCurve: "sine",
    releaseCurve: "sine",
  }).connect(filter);

  const noiseGen = new Tone.Noise({
    type: "brown",
    fadeIn: 0,
    fadeOut: 0,
    volume: 1,
  }).connect(envNode);

  function start() {
    noiseGen.start("+0.1");

    envNode.set({
      release: 10,
      attack: 5,
    });

    envNode.triggerAttack("+0.2");
  }

  function stop() {
    noiseGen.stop("+20");

    envNode.triggerRelease("+0.1");
  }

  function pause() {
    noiseGen.stop("+2.1");
    envNode.set({
      release: 2,
      attack: 2,
    });

    envNode.triggerRelease("+0.1");
  }

  const muteCtrl = computed({
    get: () => noiseGen.mute,
    set: (mute) => noiseGen.set({ mute })
  })

  return {
    start,
    stop,
    pause,
    muteCtrl,
  };
}
