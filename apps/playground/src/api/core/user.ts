import type { SysAllDictItems, UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace UserApi {
  export interface GetUserInfoResult {
    sysAllDictItems: SysAllDictItems;
    userInfo: UserInfo;
  }
}

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserApi.GetUserInfoResult>(
    '/api/sys/user/getUserInfo',
  );
}
