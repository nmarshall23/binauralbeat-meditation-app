import { BinauralBeatProgram } from "../bbPrograms";

export const mixedEffectsPragram: BinauralBeatProgram = {
  id: "BR_F01",
  title: "Mix of effects",
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
              time: "%50",
              rampTime: 10,
              signal: {
                gain: 0.4,
                synth: {
                  baseFreq: 100,
                  beatFreq: 4,
                },
              },
            },
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
              time: "+1",
              rampTime: 30,
              signal: {
                gain: 0.4,
              },
            },
            {
              time: "%25",
              rampTime: 10,
              signal: {
                gain: 0.5,
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
                  baseFreq: 180,
                },
              },
            },
          ],
        },
      },
    },
    {
      type: 'SamplePlayer',
      options: {
        gain: 0.8,
        player: {
          sample: ''
        },
        eventSequence: {
          events: [
            {
              time: "+1",
              rampTime: 30,
              signal: {
                startSample: true
              },
            },
          ]
        }
      }
    }
  ],
};
