export interface RoleItem {
  description: string;
  id?: string;
  roleCode: string;
  roleName: string;
}

export interface RoleTreeItem {
  children: RoleTreeItem[];
  icon: null | string;
  isLeaf: boolean;
  key: string;
  label: null;
  parentId: string;
  ruleFlag: 0 | 1;
  scopedSlots: { title: string };
  slotTitle: string;
  title: null | string;
  value: string;
}
