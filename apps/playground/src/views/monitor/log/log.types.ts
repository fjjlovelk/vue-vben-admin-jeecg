export interface Log {
  clientType: null | string;
  costTime: number;
  id: string;
  ip: string;
  logContent: string;
  logType: number;
  logType_dictText: string;
  method: string;
  operateType: number;
  operateType_dictText: string;
  requestParam: string;
  requestType: null | number;
  requestUrl: null | string;
  tenantId: null | string;
  userid: string;
  username: string;
}
