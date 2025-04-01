import type { HttpResponse } from '@vben/request';

import type { PageFetchParams } from '#/api/request';
import type { Role, RoleTree } from '#/views/system/role/role.types';

import { requestClient } from '#/api/request';

export namespace SystemRoleApi {
  export interface GetRoleListParams extends PageFetchParams {
    roleName: string;
    roleCode: string;
    pageNo: number;
    pageSize: number;
  }
  export interface SaveRolePermissionParams {
    lastpermissionIds: string;
    permissionIds: string;
    roleId: string;
  }
  export interface SaveDepartPermissionParams {
    lastpermissionIds: string;
    permissionIds: string;
    departId: string;
  }
  export interface GetRoleListResult extends Role {
    createBy: null | string;
    createTime: string;
    tenantId: number;
    updateBy: string;
    updateTime: string;
  }
  export interface GetRoleTreeListResult {
    ids: string[];
    treeList: RoleTree[];
  }
}

// 获取角色列表
export async function getRoleListApi(params?: SystemRoleApi.GetRoleListParams) {
  return requestClient.get<HttpResponse<SystemRoleApi.GetRoleListResult[]>>(
    '/api/sys/role/list',
    {
      params,
    },
  );
}

// 新增角色
export async function addRoleApi(data: Partial<Role>) {
  return requestClient.post<string>('/api/sys/role/add', data);
}

// 编辑角色
export async function editRoleApi(data: Partial<Role>) {
  return requestClient.post<string>('/api/sys/role/edit', data);
}

// 删除角色
export async function deleteRoleApi(params: { id: string }) {
  return requestClient.delete<string>('/api/sys/role/delete', {
    params,
  });
}

// 获取角色tree
export async function getRoleTreeListApi() {
  return requestClient.get<SystemRoleApi.GetRoleTreeListResult>(
    '/api/sys/role/queryTreeList',
  );
}

// 根据租户获取角色列表
export async function getRoleListByTenantApi() {
  return requestClient.get<SystemRoleApi.GetRoleListResult[]>(
    '/api/sys/role/queryallNoByTenant',
  );
}

// 获取角色权限
export async function getRolePermissionApi(params: { roleId: string }) {
  return requestClient.get<string[]>(
    '/api/sys/permission/queryRolePermission',
    { params },
  );
}

// 保存角色权限
export async function saveRolePermissionApi(
  data: SystemRoleApi.SaveRolePermissionParams,
) {
  return requestClient.post<string>(
    '/api/sys/permission/saveRolePermission',
    data,
  );
}

// 获取部门权限
export async function getDepartPermissionApi(params: { departId: string }) {
  return requestClient.get<string[]>(
    '/api/sys/permission/queryDepartPermission',
    { params },
  );
}

// 保存部门权限
export async function saveDepartPermissionApi(
  data: SystemRoleApi.SaveDepartPermissionParams,
) {
  return requestClient.post<string>(
    '/api/sys/permission/saveDepartPermission',
    data,
  );
}
