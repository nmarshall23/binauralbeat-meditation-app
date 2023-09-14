import { MeditationProgram } from "@/types/MeditationProgram";
import { useFromDurationToSeconds } from "@/use/useDurationInSec";

const loopIntervalSp01 = { seconds: 30 };

export const loopingCchordSpinEffectProgram: MeditationProgram = {
  id: "LPSpin01",
  title: "Spinning C Chord 7.7Hz",
  description: "Binaural Beat Follows Chord Progression",
  volumeLevel: 50,
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
          frequency: 329.63,
          type: "lowpass",
          wet: 1,
        },
        loopEvents: {
          interval: useFromDurationToSeconds(loopIntervalSp01),
          pattern: "upDown",
          values: [
            {
              rampTime: 30,
              signal: {
                gain: 1,
                filter: {
                  frequency: 329.63,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                gain: 1.1,
                filter: {
                  frequency: 293.66,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                gain: 1.2,
                filter: {
                  frequency: 329.63,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                gain: 0.8,
                filter: {
                  frequency: 349.23,
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
        gain: 0.9,
        noise: {
          type: "brown",
        },
        filter: {
          frequency: 196,
          type: "bandpass",
          wet: 0.4,
        },
        loopEvents: {
          interval: useFromDurationToSeconds(loopIntervalSp01),
          pattern: "upDown",
          values: [
            {
              rampTime: 30,
              signal: {
                gain: 0.9,
                filter: {
                  frequency: 196,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                gain: 1.1,
                filter: {
                  frequency: 196,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                gain: 0.8,
                filter: {
                  frequency: 220,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                gain: 1.0,
                filter: {
                  frequency: 220,
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
        gain: 0.2,
        synth: {
          baseFrequency: 130.81,
          beatFrequency: 7.7,
        },
        spinPanner: {
          wet: 1,
        },
        loopEvents: {
          humanize: false,
          interval: useFromDurationToSeconds(loopIntervalSp01),
          probability: 1,
          pattern: "upDown",
          values: [
            {
              rampTime: 20,
              signal: {
                gain: 0.2,
                synth: {
                  baseFreq: 130.81,
                  beatFreq: 7.7,
                },
                spinEffect: {
                  wet: 1,
                },
              },
            },
            {
              rampTime: 20,
              signal: {
                gain: 0.52,
                synth: {
                  baseFreq: 123.47,
                  beatFreq: 4.8,
                },
                spinEffect: {
                  wet: 0,
                },
              },
            },
            {
              rampTime: 20,
              signal: {
                gain: 0.4,
                synth: {
                  baseFreq: 130.81,
                  beatFreq: 5.7,
                },
                spinEffect: {
                  wet: 0,
                },
              },
            },
            {
              rampTime: 20,
              signal: {
                gain: 0.5,
                synth: {
                  baseFreq: 130.81,
                  beatFreq: 4.8,
                },
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
      type: "BinauralBeatSpinOsc",
      options: {
        gain: 0.26,
        synth: {
          baseFrequency: 82.41,
          beatFrequency: 3.8,
        },
        spinPanner: {
          wet: 0,
        },
        loopEvents: {
          humanize: false,
          interval: useFromDurationToSeconds(loopIntervalSp01),
          probability: 1,
          pattern: "upDown",
          values: [
            {
              rampTime: 20,
              signal: {
                gain: 0.26,
                synth: {
                  baseFreq: 82.41,
                  beatFreq: 4.8,
                },
                spinEffect: {
                  wet: 0,
                },
              },
            },
            {
              rampTime: 20,
              signal: {
                gain: 0.68,
                synth: {
                  baseFreq: 73.42,
                  beatFreq: 5.7,
                },
                spinEffect: {
                  wet: 1,
                },
              },
            },
            {
              rampTime: 20,
              signal: {
                gain: 0.6,
                synth: {
                  baseFreq: 82.41,
                  beatFreq: 7.7,
                },
                spinEffect: {
                  wet: 0,
                },
              },
            },
            {
              rampTime: 20,
              signal: {
                gain: 0.66,
                synth: {
                  baseFreq: 87.31,
                  beatFreq: 5.7,
                },
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
      type: "BinauralBeatSpinOsc",
      options: {
        gain: 0.28,
        synth: {
          baseFrequency: 98.0,
          beatFrequency: 5.7,
        },
        spinPanner: {
          wet: 0,
        },
        loopEvents: {
          humanize: false,
          interval: useFromDurationToSeconds(loopIntervalSp01),
          probability: 1,
          pattern: "upDown",
          values: [
            {
              rampTime: 20,
              signal: {
                gain: 0.28,
                synth: {
                  baseFreq: 98.0,
                  beatFreq: 5.7,
                },
                spinEffect: {
                  wet: 0,
                },
              },
            },
            
            {
              rampTime: 20,
              signal: {
                gain: 0.68,
                synth: {
                  baseFreq: 98.0,
                  beatFreq: 7.7,
                },
                spinEffect: {
                  wet: 0,
                },
              },
            },
            {
              rampTime: 20,
              signal: {
                gain: 0.5,
                synth: {
                  baseFreq: 110.0,
                  beatFreq: 4.8,
                },
                spinEffect: {
                  wet: 1,
                },
              },
            },
            {
              rampTime: 20,
              signal: {
                gain: 0.55,
                synth: {
                  baseFreq: 110.0,
                  beatFreq: 7.7,
                },
                spinEffect: {
                  wet: 0,
                },
              },
            },
          ],
        },
      },
    },
  ],
};
