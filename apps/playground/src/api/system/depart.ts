import type { BasicDepartInfo } from '#/views/system/depart/depart.types';

import { requestClient } from '#/api/request';

export namespace SystemDepartApi {
  export interface GetDepartTreeSyncResult extends BasicDepartInfo {
    children: SystemDepartApi.GetDepartTreeSyncResult[];
    createBy: string;
    createTime: string;
    delFlag: string;
    isLeaf: boolean;
    key: string;
    parentId: string;
    title: string;
    updateBy: string;
    updateTime: string;
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
