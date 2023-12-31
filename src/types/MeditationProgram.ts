import { SoundGeneratorDef } from "./GeneratorDef";

export type MeditationProgramGroupId = 'simple' | 'loop' | 'sequence'

export type MeditationProgram = {
    id: string;
    title: string;
    description: string;
    groupId: MeditationProgramGroupId
    generators: Array<SoundGeneratorDef>;
    volumeLevel?: number;
  };