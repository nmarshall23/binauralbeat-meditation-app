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
        beatFreq: 6,
        osc: {
          frequency: 180,
        },
        eventSequence: {
          events: [
          
            {
              time: "%50",
              rampTime: 10,
              signal: {
                gain: 0.4,
                beatFreq: 4,
                osc: {
                  frequency: 100,
                },
              },
            },
            {
              time: "-20",
              rampTime: 20,
              signal: {
                gain: 0.1,
                osc: {
                  frequency: 200,
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
        beatFreq: 4,
        osc: {
          frequency: 140,
        },
        spinEffect: 0,
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
                osc: {
                  frequency: 180,
                },
              },
            },
          ],
        },
      },
    },
  ],
};
