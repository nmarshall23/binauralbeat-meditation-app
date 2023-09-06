import { BinauralBeatProgram } from "../bbPrograms";

export const basicProgram: BinauralBeatProgram = {
  id: "Sd01",
  title: "Noise / Binaural Beat Osc",
  description: "Pink Noise & Binaural Beat @ 4hz",
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

export const simpleSpinEffectProgram: BinauralBeatProgram = {
  id: "Sd02",
  title: "Noise / Spinning Binaural Beat Osc ",
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
          wet: 0,
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
          baseFrequency: 90,
          beatFrequency: 6,
        },
      },
    },
  ],
};

export const basic01Program: BinauralBeatProgram = {
  id: "Sd03",
  title: "Noise / Binaural Beat FmSawtooth",
  description: "Pink Noise & Binaural Beat @ 4hz & 10hz",
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
      type: "BinauralBeatwLoop",
      options: {
        gain: 0.5,
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
        gain: 0.5,
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
