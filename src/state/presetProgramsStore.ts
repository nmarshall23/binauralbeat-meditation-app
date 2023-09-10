import { createStore } from "harlem";

import storageExtension from "@harlem/extension-storage";
import { presetPrograms } from "./presetPrograms";
import { MeditationProgram } from "@/types/MeditationProgram";
import { MenuListLinkItem } from "@/types/MenuList";
import { DeepReadonly } from "vue";
import composeExtension from "@harlem/extension-compose";

const STATE = {
  programs: presetPrograms as MeditationProgram[],
  menuState: [] as Array<boolean>,
};

const { state, getter, computeState, mutation } = createStore(
  "presetPrograms",
  STATE,
  {
    extensions: [
      composeExtension(),
      storageExtension({
        prefix: "NMA",
        restore: true,
        include: "update-menuState",
        branch: (state) => state.menuState,
      }),
    ],
  }
);

export const menuTopLevel = [
  {
    title: "Simple Demos",
    subtitle: "Start with these",
    group: "programs",
    groupId: "simple",
    menu: [] as MenuListLinkItem[],
  },
  {
    title: "Loopped Cycles",
    subtitle: "Showing off Pattern Loops",
    group: "programs",
    groupId: "loop",
    menu: [] as MenuListLinkItem[],
  },
  {
    title: "Evolving Beats",
    subtitle: "Changes relative to the Program Duration",
    group: "programs",
    groupId: "sequence",
    menu: [] as MenuListLinkItem[],
  },
];

const accordionMenu = getter("getAccordionMenu", (state) =>
  menuTopLevel.map((topLevel) => {
    const menu = state.programs
      .filter((item) => item.groupId === topLevel.groupId)
      .map((item) => initMenuItem(item));
    topLevel.menu = menu;
    return topLevel;
  })
);

function initMenuItem(item: DeepReadonly<MeditationProgram>) {
  const menu = {
    title: item.title,
    subtitle: item.description,
    icon: "arrow_forward",
    iconProps: {
      color: "yellow",
    },
    to: {
      name: "/program/[id]/select-duration",
      params: { id: item.id },
    },
  };
  return menu;
}

function getProgramById(id: string):DeepReadonly<MeditationProgram> | undefined {
  return state.programs.find((p) => p.id === id);
}

const programs = getter("getPrograms", (state) => state.programs);

const menuState = computeState((state) => state.menuState, "update-menuState");

const initMenuState = mutation("initMenuState", (state) => {
  if (state.menuState.length < accordionMenu.value.length) {
    const d = accordionMenu.value.length - state.menuState.length;
    state.menuState.concat(Array(d).fill(false));
  }

  const isEveryFalse = state.menuState.every((v) => v === false);
  if (isEveryFalse && isDefined(state.menuState[0])) {
    state.menuState[0] = true;
  }
});


export function usePresetProgramsStore() {
  initMenuState();

  return {
    programs,
    accordionMenu,
    menuState,
    getProgramById,
  };
}
