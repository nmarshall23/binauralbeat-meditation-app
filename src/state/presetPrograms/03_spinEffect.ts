import { MeditationProgram } from "@/types/MeditationProgram";



export const evolvingSpinEffectProgram: MeditationProgram = {
  id: "EvoSpEffP01",
  title: "Evolving Spinning Binaural Beat",
  description: "Spin Cycle evolves from 2 to 4 cyc/sec",
  volumeLevel: 60,
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
          frequency: 300,
          type: "lowpass",
        },
      },
    },
    {
      type: "BinauralBeatSpinOsc",
      options: {
        gain: 0.4,
        synth: {
          baseFrequency: 180,
          beatFrequency: 6,
        },
        loopEvents: {
          humanize: false,
          interval: 80,
          probability: 1,
          pattern: "upDown",
          values: [
            {
              rampTime: 20,
              signal: {
                gain: 0.5,
                synth: {
                  baseFreq: 180,
                  beatFreq: 6,
                },
              },
            },
            {
              rampTime: 20,
              signal: {
                gain: 0.6,
                synth: {
                  beatFreq: 4,
                  baseFreq: 90,
                },
              },
            },
          ],
        },
      },
    },
  ],
};
