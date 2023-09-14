import { MeditationProgram } from "@/types/MeditationProgram";
import {
  useFromDurationToSeconds,
  useMinDurationToSec,
} from "@/use/useDurationInSec";

export const lpBrownProgram: MeditationProgram = {
  id: "BrNBB_03",
  title: "Noise w/ LP filter | Binaural Beat @ 8.2hz & 4hz",
  description: "Spins Effect is Randomly Toggled",
  groupId: "loop",
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
      type: "BinauralBeatSpinOsc",
      options: {
        gain: 0.25,
        synth: {
          baseFrequency: 196,
          beatFrequency: 8.2,
        },
        spinPanner: {
          wet: 1,
        },
        loopEvents: {
          humanize: false,
          interval: useFromDurationToSeconds({ seconds: 60 }),
          probability: 1,
          pattern: "random",
          values: [
            {
              rampTime: 20,
              signal: {
                gain: 0.25,
                spinEffect: {
                  wet: 1,
                },
              },
            },
            {
              rampTime: 20,
              signal: {
                gain: 0.15,
                spinEffect: {
                  wet: 0,
                },
              },
            },
            {
              rampTime: 20,
              signal: {
                gain: 0.15,
                spinEffect: {
                  wet: 0,
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
        gain: 0.4,
        synth: {
          baseFrequency: 164.81,
          beatFrequency: 4,
        },
        loopEvents: {
          humanize: 10,
          interval: useFromDurationToSeconds({ seconds: 60 }),
          probability: 1,
          pattern: "upDown",
          values: [
            {
              rampTime: 30,
              signal: {
                gain: 0.4,
                synth: {
                  baseFreq: 164.81,
                  beatFreq: 4,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                gain: 0.36,
                synth: {
                  baseFreq: 185.00,
                  beatFreq: 3.6,
                },
              },
            },
          ],
        },
      },
    },
  ],
};
