import { MeditationProgram } from "@/types/MeditationProgram";

export const basicProgram: MeditationProgram = {
  id: "Sd01",
  title: "Noise / Binaural Beat Osc",
  description: "Pink Noise & Binaural Beat @ 4hz",
  groupId: 'simple',
  generators: [
    {
      type: "BasicNoiseGen",
      options: {
        gain: 1,
        noise: {
          type: "pink",
        },
      },
    },
    {
      type: "BasicBinauralBeatOsc",
      options: {
        gain: 0.7,
        beatFreq: 4,
        osc: {
          frequency: 240,
        },
      },
    },
  ],
};

export const simpleSpinEffectProgram: MeditationProgram = {
  id: "Sd02",
  title: "Noise / Spinning Binaural Beat Osc ",
  description: "Spatialized audio spinning in place",
  volumeLevel: 50,
  groupId: 'simple',
  generators: [
    {
      type: "NoiseFilteredGen",
      options: {
        gain: 0.9,
        noise: {
          type: "brown",
        },
        filter: {
          wet: 0,
          frequency: 300,
          type: "lowpass",
        },
      },
    },
    {
      type: "NoiseFilteredGen",
      options: {
        gain: 0.2,
        noise: {
          type: "pink",
        },
        filter: {
          wet: 1,
          frequency: 300,
          type: "bandpass",
        },
      },
    },
    {
      type: "BinauralBeatSpinOsc",
      options: {
        gain: 0.1,
        synth: {
          baseFrequency: 90,
          beatFrequency: 6,
        },
      },
    },
  ],
};

export const basic01Program: MeditationProgram = {
  id: "Sd03",
  title: "Noise / Binaural Beat FmSawtooth",
  description: "Pink Noise & Binaural Beat @ 4hz & 10hz",
  groupId: 'simple',
  volumeLevel: 10,
  generators: [
    {
      type: "BasicNoiseGen",
      options: {
        gain: 0.1,
        noise: {
          type: "pink",
        },
      },
    },
    {
      type: "BasicNoiseGen",
      options: {
        gain: 0.5,
        noise: {
          type: "brown",
        },
      },
    },
    {
      type: "BinauralBeatwLoop",
      options: {
        gain: 0.25,
        synth: {
          baseFrequency: 120,
          beatFrequency: 4,
          oscillator: {
            type: "fmtriangle8",
            phase: 90,
            modulationType: "sine",
            harmonicity: 2,
          },
        },
      },
    },
    {
      type: "BinauralBeatwLoop",
      options: {
        gain: 0.25,
        synth: {
          baseFrequency: 180,
          beatFrequency: 10,
          oscillator: {
            type: "fmtriangle8",
            modulationType: "sine",
            harmonicity: 2,
          },
        },
      },
    },
  ],
};
