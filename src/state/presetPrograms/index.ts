import { BinauralBeatProgram } from "../bbPrograms";
import { basicProgram, shiftingTonesProgram } from "./01_basic";
import { lpBrownProgram } from "./02_lpbrown";
import {
  evolvingSpinEffectProgram,
  simpleSpinEffectProgram,
} from "./03_spinEffect";
import { mixedEffectsPragram } from "./04_fav";

export const presetProgramsMenu = [
  {
    title: "Simple Demos",
    subtitle: "Just steady beats",
    group: 'programs', 
    open: true,
    menu: [basicProgram, lpBrownProgram, simpleSpinEffectProgram],
  },
  {
    title: "Loopped Cycles",
    subtitle: "Showing off Pattern Loops",
    group: 'programs',
    menu: [
      shiftingTonesProgram,
      evolvingSpinEffectProgram,
      mixedEffectsPragram,
    ],
  },
  {
    title: "Evolving Beats",
    subtitle: "Changes relative to the Program Duration",
    group: 'programs',
    menu: [mixedEffectsPragram],
  },
].map((groupItem) =>{
  
  const menu = groupItem.menu.map((item) => ({
    title: item.title,
    subtitle: item.description,
    icon: 'arrow_forward',
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
  shiftingTonesProgram,
  lpBrownProgram,
  simpleSpinEffectProgram,
  mixedEffectsPragram,
  evolvingSpinEffectProgram,
];
