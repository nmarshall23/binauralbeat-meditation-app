import { useMinDurationToSec } from "@/use/useDurationInSec";
import { BinauralBeatProgram } from "../bbPrograms";

export const basicProgram: BinauralBeatProgram = {
  id: "BNBB_01",
  title: "Noise and Binaural Beat Osc",
  description: "Really simple Program. Pink Noise & Binaural Beat 4hz",
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

export const shiftingTonesProgram: BinauralBeatProgram = {
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
                beatFreq: 4,
                osc: {
                  frequency: 140,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                osc: {
                  frequency: 180,
                },
                beatFreq: 8,
              },
            },
            {
              rampTime: 30,
              signal: {
                osc: {
                  frequency: 220,
                },
                beatFreq: 4,
              },
            },
          ],
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
                beatFreq: 6,
                osc: {
                  frequency: 220,
                },
              },
            },
            {
              rampTime: 60,
              signal: {
                beatFreq: 3,
                osc: {
                  frequency: 160,
                },
              },
            },
            {
              rampTime: 30,
              signal: {
                beatFreq: 6,
                osc: {
                  frequency: 220,
                },
              },
            },
          ],
        },
      },
    },
  ],
};
