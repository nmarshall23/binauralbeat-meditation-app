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
      },
    },
    {
      type: "BinauralBeatwLoop",
      options: {
        gain: 0.4,
        beatFreq: 6,
        osc: {
          frequency: 180,
        },
        eventSequence: {
          events: [
            // {
            //   time: '+10',
            //   rampTime: 20,
            //   signal: {
            //     gain: 0.6,
            //     osc: {
            //       frequency: 140,
            //     },
            //   }
            // },
            {
              time: '%50',
              rampTime: 10,
              signal: {
                gain: 0.6,
                beatFreq: 4,
                osc: {
                  frequency: 100,
                },
              }
            },
            {
              time: '-20',
              rampTime: 20,
              signal: {
                gain: 0.1,
              }
            }
          ]
        }
      },
    },
    // {
    //   type: "BinauralBeatSpinOsc",
    //   options: {
    //     gain: 0.5,
    //     beatFreq: 4,
    //     osc: {
    //       frequency: 140,
    //     },
    //     spinEffect: 0,
    //   },
    // },
  ],
};
