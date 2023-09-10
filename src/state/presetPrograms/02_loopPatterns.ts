import { MeditationProgram } from "@/types/MeditationProgram";
import { useMinDurationToSec } from "@/use/useDurationInSec";

export const shiftingTonesProgram: MeditationProgram = {
  id: "LPST01",
  title: "Noise & Two Binaural Beat Osc",
  description: "Frequency Sliding @ 2hz - 8hz & 8hz - 4hz",
  groupId: 'loop',
  generators: [
    {
      type: "BasicNoiseGen",
      options: {
        gain: 1,
        noise: {
          type: "brown",
        },
      },
    },
    {
      type: "BinauralBeatwLoop",
      options: {
        gain: 0.6,
        synth: {
          baseFrequency: 140,
          beatFrequency: 2,
        },
        loopEvents: {
          humanize: 10,
          interval: useMinDurationToSec(2),
          probability: 1,
          pattern: "upDown",
          values: [
            {
              rampTime: 30,
              signal: {
                gain: 0.4,
                synth: {
                  baseFreq: 180,
                  beatFreq: 8,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                gain: 0.6,
                synth: {
                  baseFreq: 140,
                  beatFreq: 2,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                gain: 0.4,
                synth: {
                  baseFreq: 200,
                  beatFreq: 4,
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
          baseFrequency: 220,
          beatFrequency: 10,
        },
        loopEvents: {
          humanize: 10,
          interval: useMinDurationToSec(2),
          probability: 1,
          pattern: "upDown",
          values: [
            {
              rampTime: 30,
              signal: {
                gain: 0.5,
                synth: {
                  beatFreq: 6,
                  baseFreq: 180,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                gain: 0.6,
                synth: {
                  beatFreq: 4,
                  baseFreq: 150,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                gain: 0.4,
                synth: {
                  beatFreq: 10,
                  baseFreq: 220,
                },
              },
            },
          ],
        },
      },
    },
  ],
};

export const shiftingNoiseProgram: MeditationProgram = {
  id: "LP01ST",
  title: "Shifting Noise & Binaural Beat",
  description: "Noise Filter Shifts, Binaural Beat @ 10hz - 4hz",
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
        gain: 0.6,
        synth: {
          baseFrequency: 120,
          beatFrequency: 10,
        },
        loopEvents: {
          humanize: 10,
          interval: useMinDurationToSec(2),
          probability: 1,
          pattern: "upDown",
          values: [
            {
              rampTime: 40,
              signal: {
                gain: 0.5,
                synth: {
                  baseFreq: 140,
                  beatFreq: 8,
                },
              },
            },
            {
              rampTime: 40,
              signal: {
                synth: {
                  baseFreq: 180,
                  beatFreq: 6,
                },
              },
            },
            {
              rampTime: 40,
              signal: {
                gain: 0.4,
                synth: {
                  baseFreq: 200,
                  beatFreq: 4,
                },
              },
            },
          ],
        },
      },
    },
  ],
};
