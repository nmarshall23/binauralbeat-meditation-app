import { Pattern, isMatching } from "ts-pattern";

export type MenuListLinkItem = {
  title: string;
  subtitle: string;
  to: {
    name: string;
    params: Record<string, string>;
  };
};

export type MenuListGroupItem = {
  title: string;
  subtitle?: string;
  menu: MenuListLinkItem[];
  group: string
};

export type MenuList = Array<MenuListLinkItem | MenuListGroupItem>;


export const isMenuListGroupItem = isMatching({
    menu: Pattern.not(Pattern.nullish),
    group: Pattern.string
})

export const isMenuListLinkItem = isMatching({
    to: Pattern.not(Pattern.nullish)
})