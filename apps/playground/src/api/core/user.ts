import type { SysAllDictItems, UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace UserApi {
  export interface GetUserInfoResult {
    sysAllDictItems: SysAllDictItems;
    userInfo: UserInfo;
  }
  export interface GetTenantListResult {
    applyStatus: 1 | 2;
    beginDate: string;
    companyAddress: null;
    companyLogo: null;
    companySize: null;
    createBy: string;
    createTime: string;
    delFlag: 0 | 1;
    department: null | string;
    endDate: string;
    houseNumber: string;
    id: number;
    loginBkgdImg: null | string;
    name: string;
    position: null | string;
    secondaryDomain: null | string;
    status: number;
    trade: null;
    updateBy: null | string;
    updateTime: null | string;
    workPlace: null | string;
  }
}

// 获取用户信息
export async function getUserInfoApi() {
  return requestClient.get<UserApi.GetUserInfoResult>(
    '/api/sys/user/getUserInfo',
  );
}

// 获取用户角色
export async function getUserRoleApi(params: { userid: string }) {
  return requestClient.get<string[]>('/api/sys/user/queryUserRole', {
    params,
  });
}

// 获取租户列表
export async function getTenantListApi() {
  return requestClient.get<UserApi.GetTenantListResult>(
    '/api/sys/tenant/queryList',
  );
}
