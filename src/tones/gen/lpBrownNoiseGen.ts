import * as Tone from "tone";
import { computed } from "vue";
import { useTrackToneNode } from "../../use/useTrackToneNode";

export type NoiseGenEventType = "stop" | "start";
export interface NoiseGenEvent {
  event: NoiseGenEventType;
  time: Tone.Unit.Time;
}

export function useNoiseGen() {
  const channel = new Tone.Channel(0);

  channel.send("main");

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
    if (noiseGen.state === "stopped") {
      noiseGen.start("+0.1");
    }

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
    envNode.set({
      release: 2,
      attack: 2,
    });

    envNode.triggerRelease("+0.1");
  }

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
