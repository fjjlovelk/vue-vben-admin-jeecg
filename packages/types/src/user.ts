/** 用户信息 */
type UserInfo = {
  // 同步工作流引擎1同步0不同步
  activitiSync: 0 | 1;
  avatar: string;
  createBy: string;
  createTime: string;
  // 删除状态（0，正常，1已删除）
  delFlag: 0 | 1;
  departName: string;
  email?: string;
  homePath?: string;
  id: string;
  orgCode: string;
  orgCodeTxt: string;
  phone: string;
  realname: string;
  relTenantIds: string;
  // 状态(1：正常  2：冻结 ）
  status: 1 | 2;
  // 座机号
  telephone: string;
  updateBy: string;
  updateTime: string;
  // 身份（0 普通成员 1 上级）
  userIdentity: 0 | 1;
  username: string;
};

// 操作权限
type ActionAuth = {
  action: string;
  describe: string;
  status?: string;
  type: string;
};

export type { ActionAuth, UserInfo };
