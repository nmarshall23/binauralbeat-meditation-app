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
      type: "BasicBinauralBeatOsc",
      options: {
        gain: 0.4,
        beatFreq: 4,
        osc: {
          frequency: 140,
        },
      },
    },
    {
      type: "BinauralBeatwLoop",
      options: {
        gain: 0.4,
        beatFreq: 4,
        osc: {
          frequency: 140,
        },
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
