import { createStore } from "harlem";

import composeExtension from "@harlem/extension-compose";
import { SoundGenerators } from "@/tones/SoundGenerators";
import { useMinDurationToSec } from "@/use/useDurationInSec";

export type BinauralBeatProgram = {
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
      title: "Noise and Binaural Beat Osc",
      description:
        "Really simple Program. Pink Noise & Binaural Beat 4hz",
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
    },
    {
      id: "BNBB_02",
      title: "Noise & Two Binaural Beat Osc",
      description: "Binaural Beat Shift Frequency",
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
          type: "BinauralBeatwLoop",
          options: {
            gain: 70,
            beatFreq: 4,
            osc: {
              frequency: 140,
              phase: 0,
            },
            loopEvents: {
              humanize: 10,
              interval: useMinDurationToSec(2),
              probability: 1,
              pattern: "upDown",
              values: [
                {
                  rampTime: 10,
                  signal: {
                    frequency: 140,
                  },
                },
                {
                  rampTime: 30,
                  signal: {
                    frequency: 180,
                    beatFreq: 8,
                  },
                },
                {
                  rampTime: 30,
                  signal: {
                    frequency: 220,
                    beatFreq: 4
                  },
                },
              ]
            },
          },
        },
        {
          type: "BinauralBeatwLoop",
          options: {
            gain: 70,
            beatFreq: 6,
            osc: {
              frequency: 220,
              phase: 45,
            },
            loopEvents: {
              humanize: 10,
              interval: useMinDurationToSec(1),
              probability: 1,
              pattern: "upDown",
              values: [
                {
                  rampTime: 30,
                  signal: {
                    frequency: 220,
                  },
                },
                {
                  rampTime: 60,
                  signal: {
                    frequency: 160,
                    beatFreq: 3,
                  },
                },
                {
                  rampTime: 30,
                  signal: {
                    frequency: 220,
                    beatFreq: 6
                  },
                },
              ]
            },
          },
        },
      ],
    },

    {
      id: "BrNBB_03",
      title: "Low Pass Filtered Noise and Binaural Beat Osc ",
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
          type: "BinauralBeatwLoop",
          options: {
            gain: 70,
            beatFreq: 4,
            osc: {
              frequency: 230,
            },
          },
        },
        {
          type: "BinauralBeatwLoop",
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
  ] as BinauralBeatProgram[],
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
