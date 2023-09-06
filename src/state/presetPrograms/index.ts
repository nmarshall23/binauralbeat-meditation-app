import { BinauralBeatProgram } from "../bbPrograms";
import { basic01Program, basicProgram, simpleSpinEffectProgram } from "./01_basic";
import { shiftingNoiseProgram, shiftingTonesProgram } from "./02_loopPatterns";
import { lpBrownProgram } from "./02_lpbrown";
import {
  evolvingSpinEffectProgram,
} from "./03_spinEffect";
import { mixedEffectsPragram } from "./04_fav";

export const presetProgramsMenu = [
  {
    title: "Simple Demos",
    subtitle: "Start with these",
    group: 'programs', 
    open: true,
    menu: [basicProgram, basic01Program, simpleSpinEffectProgram],
  },
  {
    title: "Loopped Cycles",
    subtitle: "Showing off Pattern Loops",
    group: 'programs',
    menu: [
      shiftingTonesProgram, shiftingNoiseProgram,
    ],
  },
  {
    title: "Evolving Beats",
    subtitle: "Changes relative to the Program Duration",
    group: 'programs',
    menu: [
      evolvingSpinEffectProgram,
      lpBrownProgram,
      mixedEffectsPragram],
  },
].map((groupItem) =>{
  
  const menu = groupItem.menu.map((item) => ({
    title: item.title,
    subtitle: item.description,
    icon: 'arrow_forward',
    iconProps: {
      color: 'yellow'
    },
    to: {
      name: "/program/[id]/select-duration",
      params: { id: item.id },
    },
  }))

  const newGroupItem = Object.assign({},groupItem, { menu } )
  return newGroupItem
}

  
);

export const presetPrograms: BinauralBeatProgram[] = [
  basicProgram,
  basic01Program,
  simpleSpinEffectProgram,
  shiftingTonesProgram,
  shiftingNoiseProgram,
  lpBrownProgram,
  mixedEffectsPragram,
  evolvingSpinEffectProgram,
];
