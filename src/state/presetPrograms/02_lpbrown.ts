import { useMinDurationToSec } from "@/use/useDurationInSec";
import { BinauralBeatProgram } from "../bbPrograms";

export const lpBrownProgram: BinauralBeatProgram = {
  id: "BrNBB_03",
  title: "Low Pass Filtered Noise and Binaural Beat Osc ",
  description: "",
  generators: [
    {
      type: "NoiseFilteredGen",
      options: {
        gain: 100,
        noise: {
          type: "brown",
        },
        filter: {
          frequency: 500,
          type: "lowpass",
        },
        
      },
    },

    {
      type: "BinauralBeatwLoop",
      options: {
        gain: 70,
        beatFreq: 4,
        osc: {
          frequency: 230,
        },
      },
    },
    {
      type: "BinauralBeatwLoop",
      options: {
        gain: 70,
        beatFreq: 4,
        osc: {
          frequency: 230,
          phase: 90,
        },
        loopEvents: {
          humanize: 10,
          interval: 30, //useMinDurationToSec(1),
          probability: 1,
          pattern: "upDown",
          values: [
            {
              rampTime: 30, //useMinDurationToSec(1),
              signal: {
                frequency: 180,
              },
            },
            {
              rampTime: 30, //useMinDurationToSec(1),
              signal: {
                frequency: 230,
              },
            },
          ],
        },
      },
    },
  ],
};
