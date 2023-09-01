import { BinauralBeatProgram } from "../bbPrograms";

export const simpleSpinEffectProgram: BinauralBeatProgram = {
  id: "BrNBB_04",
  title: "Brown Noise & Spinning Binaural Beat Osc ",
  description: "Spatialized audio spinning in place",
  volumeLevel: 60,
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
      type: "BinauralBeatSpinOsc",
      options: {
        gain: 0.4,
        beatFreq: 6,
        osc: {
          frequency: 90,
        },
        spinEffect: 1,
      },
    },
  ],
};

export const evolvingSpinEffectProgram: BinauralBeatProgram = {
  id: "EvoSpEffP01",
  title: "Evolving Spinning Binaural Beat",
  description: "Spin Cycle evolves from 2 to 4 cyc/sec",
  volumeLevel: 60,
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
      type: "BinauralBeatSpinOsc",
      options: {
        gain: 0.4,
        beatFreq: 6,
        osc: {
          frequency: 90,
        },
        spinEffect: 1,
        loopEvents: {
          humanize: false,
          interval: 80,
          probability: 1,
          pattern: "upDown",
          values: [
            {
              rampTime: 20,
              signal: {
                // spinEffect: 1,
                spinCycleFreq: 0.5,
                gain: 0.5,
                beatFreq: 6,
                osc: {
                  frequency: 180,
                },
              },
            },
            {
              rampTime: 20,
              signal: {
                // spinEffect: 0,
                spinCycleFreq: 0.25,
                gain: 0.6,
                beatFreq: 4,
                osc: {
                  frequency: 90,
                },
              },
            },
          ],
        },
      },
    },
  ],
};