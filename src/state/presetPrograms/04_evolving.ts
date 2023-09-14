import { MeditationProgram } from "@/types/MeditationProgram";
import { useFromDurationToSeconds } from "@/use/useDurationInSec";

export const evolve01Program: MeditationProgram = {
  id: "Ev01",
  title: "Spining In and out",
  description: "Bell chime marks the Time",
  groupId: "sequence",
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
        eventSequence: {
          events: [
            {
              time: "-20",
              rampTime: 20,
              signal: {
                gain: 0.1,
              },
            },
          ],
        },
        loopEvents: {
          pattern: "upDown",
          interval: 15,
          values: [
            {
              rampTime: 10,
              signal: {
                gain: 1.1,
                filter: {
                  Q: 10,
                },
              },
            },
            {
              rampTime: 10,
              signal: {
                gain: 0.9,
                filter: {
                  Q: 4,
                },
              },
            },
            {
              rampTime: 10,
              signal: {
                gain: 1,
                filter: {
                  Q: 1,
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
        gain: 0.3,
        synth: {
          baseFrequency: 180,
          beatFrequency: 6,
        },
        eventSequence: {
          events: [
            {
              time: "-20",
              rampTime: 20,
              signal: {
                gain: 0.1,
                synth: {
                  baseFreq: 200,
                },
              },
            },
          ],
        },
        loopEvents: {
          interval: useFromDurationToSeconds({ minutes: 2 }),
          pattern: "upDown",
          values: [
            {
              rampTime: 40,
              signal: {
                gain: 0.4,
                synth: {
                  baseFreq: 140,
                  beatFreq: 8,
                },
              },
            },
            {
              rampTime: 40,
              signal: {
                gain: 0.3,
                synth: {
                  baseFreq: 180,
                  beatFreq: 6,
                },
              },
            },
            {
              rampTime: 40,
              signal: {
                gain: 0.3,
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
      type: "BinauralBeatSpinOsc",
      options: {
        gain: 0.05,
        synth: {
          baseFrequency: 140,
          beatFrequency: 4,
        },
        spinPanner: {
          wet: 0,
        },
        eventSequence: {
          events: [
            {
              time: "%25",
              rampTime: 10,
              signal: {
                gain: 0.4,
                spinEffect: 1,
              },
            },
            {
              time: "%75",
              rampTime: 10,
              signal: {
                spinEffect: 0,
              },
            },
            {
              time: "-20",
              rampTime: 20,
              signal: {
                gain: 0.1,
                synth: {
                  baseFreq: 100,
                },
              },
            },
          ],
        },
      },
    },

    {
      type: "SamplePlayer",
      options: {
        gain: 0.65,
        player: {
          sample: "bell_mallett_1",
        },
        eventSequence: {
          events: [
            {
              time: "+1",
              rampTime: 0,
              signal: {
                startSample: true,
              },
            },
            {
              time: "-9",
              rampTime: 0,
              signal: {
                startSample: true,
              },
            },
            {
              time: "-6",
              rampTime: 0,
              signal: {
                startSample: true,
              },
            },
            {
              time: "-4",
              rampTime: 0,
              signal: {
                startSample: true,
              },
            },
          ],
        },
      },
    },
  ],
};
