import type { UserInfo } from '@vben/types';

import { acceptHMRUpdate, defineStore } from 'pinia';

interface AccessState {
  /**
   * 用户信息
   */
  userInfo: null | UserInfo;
  /**
   * 用户角色
   */
  userRoles: string[];
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(userInfo: null | UserInfo) {
      // 设置用户信息
      this.userInfo = userInfo;
    },
    setUserRoles(roles: string[]) {
      this.userRoles = roles;
    },
  },
  state: (): AccessState => ({
    userInfo: null,
    userRoles: [],
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
