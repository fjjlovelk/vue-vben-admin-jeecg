import type { ActionAuth, RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace MenuApi {
  export interface GetUserPermissionByTokenResult {
    allAuth: ActionAuth[];
    auth: ActionAuth[];
    menu: RouteRecordStringComponent[];
  }
}

/**
 * 获取用户所有菜单
 */
export async function getUserPermissionByTokenApi() {
  return requestClient.get<MenuApi.GetUserPermissionByTokenResult>(
    '/api/sys/permission/getUserPermissionByToken',
  );
}
