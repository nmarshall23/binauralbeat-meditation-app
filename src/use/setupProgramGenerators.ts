import { match } from "ts-pattern";
import { createBasicNoiseGen } from "../tones/gen/BasicNoiseGen";
import { createBasicBinauarlBeatOsc } from "../tones/gen/BasicBinauarlBeatOsc";
import {
  AdvBinauarlBeatOscOptions,
  BinauralBeatSpinOscOptions,
  SoundGenerators,
} from "../tones/SoundGenerators";
import { EventHookOn } from "@vueuse/core";
import { createNoiseFilteredGen } from "../tones/gen/NoiseFilteredGen";
import { createAdvBinauarlBeatOsc } from "../tones/gen/AdvBinauarlBeatOsc";
import { createBinauralBeatSpinOsc } from "../tones/gen/BinauralBeatSpinOsc";

type EventHandler = {
  onPlayBackPaused: EventHookOn<number>;
  onPlayBackStarted: EventHookOn<number>;
  onPlayBackStopped: EventHookOn<number>;
};

export function setupProgramGenerators(
  generators: Array<SoundGenerators>,
  eventHandler: EventHandler
) {
  let noiseGenCount = 0;
  let binauralBeatOscCount = 0;

  return generators
    .map((genDef) =>
      match(genDef)
        .with(
          {
            type: "BasicNoiseGen",
          },
          (def) => {
            noiseGenCount++;
            return createBasicNoiseGen(
              `Noise #${noiseGenCount}`,
              eventHandler,
              def.options
            );
          }
        )
        .with(
          {
            type: "BasicBinauarlBeatOsc",
          },
          (def) => {
            binauralBeatOscCount++;
            return createBasicBinauarlBeatOsc(
              `Binaural Osc #${binauralBeatOscCount}`,
              eventHandler,
              def.options
            );
          }
        )
        .with(
          {
            type: "NoiseFilteredGen",
          },
          (def) => {
            noiseGenCount++;
            return createNoiseFilteredGen(
              `Noise #${noiseGenCount}`,
              eventHandler,
              def.options
            );
          }
        )
        .with(
          {
            type: "AdvBinauarlBeatOsc",
          },
          ({ options }) => {
            binauralBeatOscCount++;
            return createAdvBinauarlBeatOsc(
              `Binaural Osc #${binauralBeatOscCount}`,
              eventHandler,
              options as AdvBinauarlBeatOscOptions
            );
          }
        )
        .with(
          {
            type: "BinauralBeatSpinOsc",
          },
          ({ options }) => {
            binauralBeatOscCount++;
            return createBinauralBeatSpinOsc(
              `Binaural Spin Osc #${binauralBeatOscCount}`,
              eventHandler,
              options as BinauralBeatSpinOscOptions
            );
          }
        )
        .otherwise((def) => {
          console.log("Unknow Generator %o", def);
          return null;
        })
    )
    .filter(notEmpty);
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  if (value === null || value === undefined) return false;
  return true;
}
