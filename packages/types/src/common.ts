// 字典
export interface DictItem {
  label: string;
  text: string;
  title: string;
  value: string;
}

export type SysAllDictItems = Record<string, DictItem[]>;

export interface BaseTreeItem {
  children: BaseTreeItem[];
  key: string;
  title: string;
  value: string;
}
