import { useMinDurationToSec } from "@/use/useDurationInSec";
import { BinauralBeatProgram } from "../bbPrograms";

export const simpleSpinEffectProgram: BinauralBeatProgram = {
  id: "BrNBB_04",
  title: "Brown Noise & Spinning Binaural Beat Osc ",
  description: "Spatialized audio spinning in place",
  volumeLevel: 70,
  generators: [
    {
      type: "NoiseFilteredGen",
      options: {
        gain: 1,
        noise: {
          type: "brown",
        },
        filter: {
          frequency: 300,
          type: "lowpass",
        },
      },
    },
    {
      type: "BinauralBeatSpinOsc",
      options: {
        gain: 0.5,
        beatFreq: 6,
        osc: {
          frequency: 90,
        },
        spinEffect: 1,
        // loopEvents: {
        //   humanize: false,
        //   interval: 40,
        //   probability: 1,
        //   pattern: "upDown",
        //   values: [
        //     {
        //       rampTime: 20,
        //       signal: {
        //         spinEffect: 1,
        //         gain: 0.5,
        //         beatFreq: 6,
        //         osc: {
        //           frequency: 180,
        //         },
        //       },
        //     },
        //     {
        //       rampTime: 20,
        //       signal: {
        //         spinEffect: 0,
        //         gain: 0.6,
        //         beatFreq: 4,
        //         osc: {
        //           frequency: 90,
        //         },
        //       },
        //     },
        //   ],
        // },
      },
    },
  ],
};
