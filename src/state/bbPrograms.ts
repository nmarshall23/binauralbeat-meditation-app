import { createStore } from "harlem";

import { useMinDurationToSec } from "../use/useDurationInSec";
import { SoundGenerators } from "../tones/SoundGenerators";
import composeExtension from "@harlem/extension-compose";

export type BinauarlBeatProgram = {
  id: string;
  title: string;
  description: string;
  generators: Array<SoundGenerators>;
};

const STATE = {
  currentProgramId: null as string | null,
  programs: [
    {
      id: "BNBB_01",
      title: "Basic Noise and Binauarl Beat Osc",
      description:
        "Really simple Program. Just Pink Noise and a Single 4hz Binauarl Beat",
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
          type: "BasicBinauarlBeatOsc",
          options: {
            gain: 0.7,
            beatFreq: 4,
            osc: {
              frequency: 240,
            },
          },
        },
      ],
    },
    {
      id: "BNBB_02",
      title: "Basic Noise and 2 out of phase Binauarl Beat Osc",
      description: "",
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
          type: "BasicBinauarlBeatOsc",
          options: {
            gain: 0.7,
            beatFreq: 4,
            osc: {
              frequency: 120,
              phase: 0,
            },
          },
        },
        {
          type: "BasicBinauarlBeatOsc",
          options: {
            gain: 0.7,
            beatFreq: 4,
            osc: {
              frequency: 180,
              phase: 90,
            },
          },
        },
      ],
    },

    {
      id: "BrNBB_03",
      title: "Low Pass Filtered Noise and Binauarl Beat Osc ",
      description: "",
      generators: [
        {
          type: "NoiseFilteredGen",
          options: {
            gain: 100,
            noise: {
              type: "brown",
            },
            filter: {
              frequency: 500,
              type: "lowpass",
            },
          },
        },

        {
          type: "AdvBinauarlBeatOsc",
          options: {
            gain: 70,
            beatFreq: 4,
            osc: {
              frequency: 230,
            },
          },
        },
        {
          type: "AdvBinauarlBeatOsc",
          options: {
            gain: 70,
            beatFreq: 4,
            osc: {
              frequency: 230,
              phase: 90,
            },
            loopEvents: {
              humanize: 10,
              interval: 30, //useMinDurationToSec(1),
              probability: 1,
              pattern: "upDown",
              values: [
                {
                  rampTime: 30, //useMinDurationToSec(1),
                  signal: {
                    frequency: 180,
                  },
                },
                {
                  rampTime: 30, //useMinDurationToSec(1),
                  signal: {
                    frequency: 230,
                  },
                },
              ],
            },
          },
        },
      ],
    },

    {
      id: "BrNBB_04",
      title: "Brown Noise & Spining Binaural Beat Osc ",
      description: "Brown Noise with a deep Lowpass filter.",
      generators: [
        {
          type: "NoiseFilteredGen",
          options: {
            gain: 100,
            noise: {
              type: "brown",
            },
            filter: {
              frequency: 300,
              type: "lowpass",
              gain: 2,
            },
          },
        },

        {
          type: "BinauralBeatSpinOsc",
          options: {
            gain: 10,
            beatFreq: 4,
            spinCrossFade: 1,
            osc: {
              frequency: 140,
            },
            loopEvents: {
              humanize: 15,
              interval: useMinDurationToSec(1),
              probability: 1,
              pattern: "up",
              values: [
                {
                  rampTime: 30,
                  signal: {
                    frequency: 100,
                  },
                },
                {
                  rampTime: 30,
                  signal: {
                    spinCycle: 0.5
                  },
                },
                {
                  rampTime: 30,
                  signal: {
                    frequency: 140,
                  },
                },
                {
                  rampTime: 30,
                  signal: {
                    spinCycle: 0.1
                  },
                },
              ],
            },
          },
        },
      ],
    },
  ] as BinauarlBeatProgram[],
};

export const {
  state,

  computeState,
  getter,
  ...store
} = createStore("binauralBeatPrograms", STATE, {
  extensions: [composeExtension()],
});

const programs = getter("getPrograms", (state) => state.programs);

const currentProgramId = computeState((state) => state.currentProgramId);

const currentProgram = getter("currentProgram", (state) =>
  state.programs.find((p) => p.id === state.currentProgramId)
);

export function useBinauralBeatPrograms() {
  return {
    programs,
    currentProgramId,
    currentProgram,
  };
}
