import type { HttpResponse } from '@vben/request';

import type { PermissionMenuItem } from '#/views/system/menu/types';

import { requestClient } from '#/api/request';

export namespace SystemMenuApi {
  export interface GetPermissionListParams {
    name: string;
  }
  export interface GetPermissionListResult extends PermissionMenuItem {
    children: SystemMenuApi.GetPermissionListResult[];
    createBy: string;
    createTime: string;
    delFlag: 0 | 1;
    description: null | string;
    isLeaf: boolean;
    key: string;
    leaf: false;
    moduleId: string;
    moduleName: null;
    title: string;
    unitLevel: null;
    updateBy: string;
    updateTime: string;
  }
}

// 获取菜单列表
export async function getPermissionListApi(
  params?: SystemMenuApi.GetPermissionListParams,
) {
  return requestClient.get<
    HttpResponse<SystemMenuApi.GetPermissionListResult[]>
  >('/api/sys/permission/list', {
    params,
    responseReturn: 'body',
  });
}

// 新增菜单
export async function addPermissionApi(data: PermissionMenuItem) {
  return requestClient.post<string>('/api/sys/permission/add', data);
}

// 编辑菜单
export async function editPermissionApi(data: PermissionMenuItem) {
  return requestClient.post<string>('/api/sys/permission/edit', data);
}

// 删除菜单
export async function deletePermissionApi(params: { id: string }) {
  return requestClient.delete<string>(`/api/sys/permission/delete`, {
    params,
  });
}
