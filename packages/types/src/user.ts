/** 基础用户信息 */
interface BasicUserInfo {
  // 同步工作流引擎1同步0不同步
  activitiSync: 0 | 1;
  avatar: string;
  birthday: null | string;
  departIds: string;
  email: string;
  id: string;
  phone: string;
  post: string;
  realname: string;
  sex: 1 | 2;
  telephone: string;
  // 身份（1 普通成员 2 上级）
  userIdentity: 1 | 2;
  username: string;
  workNo: string;
}

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
  relTenantIds: string;
  departName: string;
  homePath?: string;
  orgCode: string;
  orgCodeTxt: string;
  sex_dictText: string;
  // 状态(1：正常  2：冻结 ）
  status: 1 | 2;
  status_dictText: string;
}

// 操作权限
type ActionAuth = {
  action: string;
  describe: string;
  status?: string;
  type: string;
};

export type { ActionAuth, BasicUserInfo, UserInfo };
