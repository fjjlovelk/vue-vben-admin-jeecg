import type { BasicRecord, Recordable } from '@vben/types';

import type { BasicDepartInfo } from '#/views/system/depart/depart.types';

import { requestClient } from '#/api/request';

export namespace SystemDepartApi {
  export interface GetDepartTreeSyncResult
    extends BasicDepartInfo,
      BasicRecord {
    children: SystemDepartApi.GetDepartTreeSyncResult[];
    isLeaf: boolean;
    key: string;
    parentId: string;
    title: string;
    value: string;
  }
}

// 获取部门列表
export async function getDepartTreeSyncApi(params?: { pid: string }) {
  return requestClient.get<SystemDepartApi.GetDepartTreeSyncResult[]>(
    '/api/sys/sysDepart/queryDepartTreeSync',
    { params },
  );
}

// 新增部门
export async function addDepartApi(data: BasicDepartInfo) {
  return requestClient.post<string>('/api/sys/sysDepart/add', data);
}

// 编辑部门
export async function editDepartApi(data: BasicDepartInfo) {
  return requestClient.post<string>('/api/sys/sysDepart/edit', data);
}

// 删除部门
export async function deleteDepartApi(params: { id: string }) {
  return requestClient.delete<string>('/api/sys/sysDepart/delete', {
    params,
  });
}

// 批量删除部门
export async function deleteBatchDepartApi(params: { ids: string }) {
  return requestClient.delete<string>('/api/sys/sysDepart/deleteBatch', {
    params,
  });
}

// 查找部门
export async function searchDepartApi(params: { keyWord: string }) {
  return requestClient.get<SystemDepartApi.GetDepartTreeSyncResult[]>(
    '/api/sys/sysDepart/searchBy',
    {
      params,
    },
  );
}

// 获取部门树
export async function getDepartTreeApi(params: Recordable<any>) {
  return requestClient.get<SystemDepartApi.GetDepartTreeSyncResult[]>(
    '/api/sys/sysDepart/queryTreeList',
    {
      params,
    },
  );
}
