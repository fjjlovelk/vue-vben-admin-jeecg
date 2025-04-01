// 基础的label-value
export interface LabelValueOption {
  label: string;
  text: string;
  title: string;
  value: string;
}

export type SysAllDictItems = Record<string, LabelValueOption[]>;

export interface BasicTreeItem {
  children: BasicTreeItem[];
  key: string;
  title: string;
  value: string;
}

export interface BasicRecord {
  createBy: string;
  createTime: string;
  delFlag: 0 | 1;
  updateBy: null | string;
  updateTime: null | string;
}
