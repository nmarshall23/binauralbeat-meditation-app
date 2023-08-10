import * as Tone from "tone";
import { match } from "ts-pattern";

export type NoiseGenEventType = "stop" | "start";
export interface NoiseGenEvent {
  event: NoiseGenEventType
  time: Tone.Unit.Time
}

export function useNoiseGen() {
  const channel = new Tone.Channel(0).send("main");
  

  const env = new Tone.AmplitudeEnvelope({
    attack: 10,
    decay: 0,
    sustain: 0.5,
    release: 10,
    attackCurve: "sine",
    releaseCurve: "sine",
  }).connect(channel);

  const filter = new Tone.Filter({
    frequency: 400,
    type: 'lowpass',
    
  }).connect(channel)

  const noiseGen = new Tone.Noise({
    type: "brown",
    fadeIn: 0,
    fadeOut: 0,
    volume: 1
  }).connect(filter)



  function start() {
    noiseGen.start();

    env.triggerAttack("+1");
  }

  function stop() {
    // noiseGen.stop();
    env.triggerRelease();
  }

  function pause() {
    noiseGen.stop();
  
    env.triggerRelease();
  }



  return {
    start,
    stop,
    pause,
  };
}
