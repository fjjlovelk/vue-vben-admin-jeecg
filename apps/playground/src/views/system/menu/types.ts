export interface PermissionMenuItem {
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
  menuType: number;
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
