export interface Dict {
  description: null | string;
  dictCode: string;
  dictName: string;
  id: string;
}

export interface DictItem {
  description: null | string;
  itemColor: null | string;
  itemText: string;
  itemValue: string;
  sortOrder: number;
  status: number;
  id: string;
}
