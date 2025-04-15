import type { HttpResponse } from '@vben/request';
import type { BasicRecord } from '@vben/types';

import type { PageFetchParams } from '#/api/request';
import type { Log } from '#/views/monitor/log/log.types';

import { requestClient } from '#/api/request';

export namespace MonitorLogApi {
  export interface GetLogListParams extends PageFetchParams {
    column: string;
    order: string;
    keyWord?: string;
    operateType?: string;
    createTime_begin: string;
    createTime_end: string;
    logType: string;
  }
  export interface GetLogListResult extends BasicRecord, Log {}
}

// 获取日志列表
export async function getLogListApi(params?: MonitorLogApi.GetLogListParams) {
  return requestClient.get<HttpResponse<MonitorLogApi.GetLogListResult>>(
    '/api/sys/log/list',
    {
      params,
    },
  );
}
