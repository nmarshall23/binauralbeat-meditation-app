import { useMinDurationToSec } from "@/use/useDurationInSec";
import { BinauralBeatProgram } from "../bbPrograms";

export const simpleSpinEffectProgram: BinauralBeatProgram = {
  id: "BrNBB_04",
  title: "Brown Noise & Spining Binaural Beat Osc ",
  description: "Brown Noise with a deep Lowpass filter.",
  volumeLevel: 70,
  generators: [
    {
      type: "NoiseFilteredGen",
      options: {
        gain: 100,
        noise: {
          type: "brown",
        },
        filter: {
          frequency: 300,
          type: "lowpass",
          gain: 2,
        },
      },
    },
    {
      type: "BinauralBeatSpinOsc",
      options: {
        gain: 10,
        beatFreq: 4,
        spinCrossFade: 1,
        osc: {
          frequency: 140,
        },
        loopEvents: {
          humanize: 15,
          interval: useMinDurationToSec(1),
          probability: 1,
          pattern: "up",
          values: [
            {
              rampTime: 30,
              signal: {
                frequency: 100,
              },
            },
            {
              rampTime: 30,
              signal: {
                spinCycle: 0.5,
              },
            },
            {
              rampTime: 30,
              signal: {
                frequency: 140,
              },
            },
            {
              rampTime: 30,
              signal: {
                spinCycle: 0.1,
              },
            },
          ],
        },
      },
    },
  ],
};
