import { MeditationProgram } from "@/types/MeditationProgram";
import { useMinDurationToSec } from "@/use/useDurationInSec";

export const lpBrownProgram: MeditationProgram = {
  id: "BrNBB_03",
  title: "Noise w/ LP filter | Binaural Beat @ 8hz & 6hz",
  description: "",
  groupId: 'loop',
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
          interval: useMinDurationToSec(2),
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
        synth: {
          baseFrequency: 210,
          beatFrequency: 8,
        },
      },
    },
    {
      type: "BinauralBeatwLoop",
      options: {
        gain: 0.5,
        synth: {
          baseFrequency: 160,
          beatFrequency: 4,
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
                synth: {
                  baseFreq: 140
                }
              },
            },
            {
              rampTime: 30, //useMinDurationToSec(1),
              signal: {
                gain: 0.4,
                synth: {
                  baseFreq: 170
                }
              },
            },
          ],
        },
      },
    },
  ],
};
