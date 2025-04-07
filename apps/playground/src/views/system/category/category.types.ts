export interface Category {
  code: string;
  hasChild: '1' | null;
  id: string;
  name: string;
  pid: string;
  sysOrgCode: string;
  tenantId: number;
}
