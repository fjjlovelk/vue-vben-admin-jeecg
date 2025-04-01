export interface PermissionMenu {
  alwaysShow: boolean;
  component: string;
  componentName: null | string;
  frameSrc: string;
  hidden: boolean;
  hideTab: boolean;
  icon: string;
  id?: string;
  internalOrExternal: boolean;
  keepAlive: boolean;
  menuType: 0 | 1 | 2;
  name: string;
  parentId: null | string;
  perms: null | string;
  permsType: string;
  redirect: string;
  route: boolean;
  sortNo: number;
  status: null | number;
  url: string;
}
