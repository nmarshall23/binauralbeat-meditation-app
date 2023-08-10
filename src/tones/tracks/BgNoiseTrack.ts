import * as Tone from "tone";
import { NoiseGenEventType, useNoiseGen } from "../gen/noiseGen";



export function setUpBgNoiseTrack() {

  const noiseGen = useNoiseGen();

  const part = new Tone.Part<{ time: Tone.Unit.Time, event: NoiseGenEventType }>(
    (time, event) => noiseGen.eventHandler(time, event),
    [
      {
        time: "+0",
        event: "start",
      },
      {
        time: "+240",
        event: "stop",
      },
    ]
  )

  function setup() {
    console.log("Noise Track %o", part.get())
  }

  return {
    start: part.start,
    stop: part.stop,
    setup,
  };
}
