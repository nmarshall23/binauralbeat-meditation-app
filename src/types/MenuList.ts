import { Pattern, isMatching } from "ts-pattern";

export type MenuValueItem = {
  title: string;
  icon?: string;
  iconProps?: Record<string, string>
  value: string 
  disable?: boolean
  hidden?: boolean
}

export type MenuListLinkItem = {
  title: string;
  subtitle: string;
  icon?: string;
  iconProps?: Record<string, string>
  to: {
    name: string;
    params: Record<string, string>;
  };
};

export type MenuListGroupItem = {
  title: string;
  subtitle?: string;
  menu: MenuListLinkItem[];
  group: string;
  open?: boolean;
};

export type MenuList = Array<MenuListLinkItem | MenuListGroupItem>;

export const isMenuListGroupItem = isMatching({
  menu: Pattern.not(Pattern.nullish),
  group: Pattern.string,
});

export const isMenuListLinkItem = isMatching({
  to: Pattern.not(Pattern.nullish),
});
