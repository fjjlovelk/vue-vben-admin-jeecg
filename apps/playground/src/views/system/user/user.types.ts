import type { BasicUserInfo } from '@vben/types';

export interface SaveUserInfo extends BasicUserInfo {
  relTenantIds: string[];
  selecteddeparts: string[];
  selectedroles: string[];
}
