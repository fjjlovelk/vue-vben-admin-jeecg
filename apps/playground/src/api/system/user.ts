import type { HttpResponse } from '@vben/request';
import type { BaseTreeItem, UserInfo } from '@vben/types';

import type { PageFetchParams } from '#/api/request';

import { requestClient } from '#/api/request';

export namespace SystemUserApi {
  export interface GetUserListParams extends PageFetchParams {
    username?: string;
    realname?: string;
    sex?: number;
    phone?: string;
    status?: UserInfo['status'];
  }
  export interface FreezeBatchUserParams {
    ids: string;
    status: UserInfo['status'];
  }
  export interface GetUserRoleListParams extends PageFetchParams {
    roleId: string;
  }
  export interface AddUserRoleParams {
    roleId: string;
    userIdList: string[];
  }
  export interface DeleteUserRoleParams {
    userId: string;
    roleId: string;
  }
  export interface DeleteUserRoleBatchParams {
    userIds: string;
    roleId: string;
  }
}

// 获取所有用户列表
export async function getUserListAllApi(
  params?: SystemUserApi.GetUserListParams,
) {
  return requestClient.get<HttpResponse<UserInfo[]>>('/api/sys/user/listAll', {
    params,
  });
}

// 获取用户列表
export async function getUserListApi(params?: SystemUserApi.GetUserListParams) {
  return requestClient.get<HttpResponse<UserInfo[]>>('/api/sys/user/list', {
    params,
  });
}

// 获取回收站用户列表
export async function getRecycleUserListApi(params?: PageFetchParams) {
  return requestClient.get<HttpResponse<UserInfo[]>>(
    '/api/sys/user/recycleBin',
    {
      params,
    },
  );
}

// 新增用户
export async function addUserApi(data: Partial<UserInfo>) {
  return requestClient.post<string>('/api/sys/user/add', data);
}

// 编辑用户
export async function editUserApi(data: Partial<UserInfo>) {
  return requestClient.post<string>('/api/sys/user/edit', data);
}

// 删除用户
export async function deleteUserApi(params: { id: string }) {
  return requestClient.delete<string>('/api/sys/user/delete', {
    params,
  });
}

// 批量删除用户
export async function deleteBatchUserApi(params: { ids: string }) {
  return requestClient.delete<string>('/api/sys/user/deleteBatch', {
    params,
  });
}

// 冻结/解冻用户
export async function freezeBatchUserApi(
  data: SystemUserApi.FreezeBatchUserParams,
) {
  return requestClient.put<string>('/api/sys/user/frozenBatch', data);
}

// 取回回收站用户
export async function revertBatchUserApi(data: { userIds: string }) {
  return requestClient.put<string>('/api/sys/user/putRecycleBin', data);
}

// 获取用户所属部门
export async function getUserDepartListApi(params: { userId: string }) {
  return requestClient.get<BaseTreeItem[]>('/api/sys/user/userDepartList', {
    params,
  });
}

// 根据角色id获取用户
export async function getUserRoleListApi(
  params: SystemUserApi.GetUserRoleListParams,
) {
  return requestClient.get<HttpResponse<UserInfo[]>>(
    '/api/sys/user/userRoleList',
    {
      params,
    },
  );
}

// 添加用户角色绑定关系
export async function addUserRoleApi(data: SystemUserApi.AddUserRoleParams) {
  return requestClient.post<string>('/api/sys/user/addSysUserRole', data);
}

// 删除用户角色绑定关系
export async function deleteUserRoleApi(
  params: SystemUserApi.DeleteUserRoleParams,
) {
  return requestClient.delete<HttpResponse<UserInfo[]>>(
    '/api/sys/user/deleteUserRole',
    {
      params,
    },
  );
}

// 批量删除用户角色绑定关系
export async function deleteUserRoleBatchApi(
  params: SystemUserApi.DeleteUserRoleBatchParams,
) {
  return requestClient.delete<HttpResponse<UserInfo[]>>(
    '/api/sys/user/deleteUserRoleBatch',
    {
      params,
    },
  );
}
