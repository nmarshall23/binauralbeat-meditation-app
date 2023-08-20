import { match } from "ts-pattern";
import { createBasicNoiseGen } from "../tones/gen/BasicNoiseGen";
import { createBasicBinauralBeatOsc } from "../tones/gen/BasicBinauralBeatOsc";
import {
  BinauralBeatwLoopOscOptions,
  BinauralBeatSpinOscOptions,
  SoundGenerators,
  PlaybackTriggers,
} from "../types/GeneratorDef";
import { createNoiseFilteredGen } from "../tones/gen/NoiseFilteredGen";
import { createBinauralBeatwLoop } from "../tones/gen/BinauralBeatwLoop";
import { createBinauralBeatSpinOsc } from "../tones/gen/BinauralBeatSpinOsc";
import { GeneratorControls } from "@/types/GeneratorControls";

export function setupProgramGenerators(
  generators: Array<SoundGenerators>,
  eventHandler: PlaybackTriggers
): Array<GeneratorControls> {
  let noiseGenCount = 0;
  let binauralBeatOscCount = 0;

  return generators
    .map((genDef) =>
      match<SoundGenerators, GeneratorControls | null>(genDef)
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
            type: "BasicBinauralBeatOsc",
          },
          (def) => {
            binauralBeatOscCount++;
            return createBasicBinauralBeatOsc(
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
            type: "BinauralBeatwLoop",
          },
          ({ options }) => {
            binauralBeatOscCount++;
            return createBinauralBeatwLoop(
              `Binaural Osc #${binauralBeatOscCount}`,
              eventHandler,
              options as BinauralBeatwLoopOscOptions
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
