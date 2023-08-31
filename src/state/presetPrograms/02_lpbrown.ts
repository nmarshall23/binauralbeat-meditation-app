import { useMinDurationToSec } from "@/use/useDurationInSec";
import { BinauralBeatProgram } from "../bbPrograms";

export const lpBrownProgram: BinauralBeatProgram = {
  id: "BrNBB_03",
  title: "Low Pass Brown Noise",
  description: "",
  generators: [
    {
      type: "NoiseFilteredGen",
      options: {
        gain: 1,
        noise: {
          type: "brown",
        },
        filter: {
          frequency: 500,
          type: "lowpass",
        },
        loopEvents: {
          humanize: 30,
          interval: 30,
          probability: 0.25,
          pattern: "randomWalk",
          values: [
            {
              rampTime: 30,
              signal: {
                gain: 1.2,
                filter: {
                  frequency: 300,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                gain: 0.9,
                filter: {
                  frequency: 800,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                gain: 1,
                filter: {
                  frequency: 500,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                gain: 1.4,
                filter: {
                  frequency: 200,
                },
              },
            },
          ],
        },
      },
    },

    {
      type: "BinauralBeatwLoop",
      options: {
        gain: 0.5,
        beatFreq: 8,
        osc: {
          frequency: 210,
        },
      },
    },
    {
      type: "BinauralBeatwLoop",
      options: {
        gain: 0.5,
        beatFreq: 4,
        osc: {
          frequency: 160,
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
                gain: 0.6,
                osc: {
                  frequency: 140
                }
              },
            },
            {
              rampTime: 30, //useMinDurationToSec(1),
              signal: {
                gain: 0.4,
                osc: {
                  frequency: 170
                }
              },
            },
          ],
        },
      },
    },
  ],
};
