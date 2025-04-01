import type { HttpResponse } from '@vben/request';
import type { BasicRecord } from '@vben/types';

import type { PageFetchParams } from '#/api/request';
import type { Dict, DictItem } from '#/views/system/dict/dict.types';

import { requestClient } from '#/api/request';

export namespace SystemDictApi {
  export interface GetDictListParams extends PageFetchParams {
    dictName?: string;
    dictCode?: string;
  }
  export interface GetDictItemListParams extends PageFetchParams {
    dictId: string;
    itemText?: string;
    status?: string;
  }
  export interface SaveDictItemParams extends Partial<DictItem> {
    dictId: string;
  }
  export interface GetDictListResult extends BasicRecord, Dict {}
  export interface GetDictItemListResult extends BasicRecord, DictItem {
    dictId: string;
  }
}

// 获取字典列表
export async function getDictListApi(params?: SystemDictApi.GetDictListParams) {
  return requestClient.get<HttpResponse<SystemDictApi.GetDictListResult[]>>(
    '/api/sys/dict/list',
    { params },
  );
}

// 新增字典
export async function addDictApi(data: Partial<Dict>) {
  return requestClient.post<string>('/api/sys/dict/add', data);
}

// 编辑字典
export async function editDictApi(data: Partial<Dict>) {
  return requestClient.post<string>('/api/sys/dict/edit', data);
}

// 删除字典
export async function deleteDictApi(params: { id: string }) {
  return requestClient.delete<string>('/api/sys/dict/delete', {
    params,
  });
}

// 批量删除字典
export async function deleteBatchDictApi(params: { ids: string }) {
  return requestClient.delete<string>('/api/sys/dict/deleteBatch', {
    params,
  });
}

// 获取数据字典项列表
export async function getDictItemListApi(
  params?: SystemDictApi.GetDictItemListParams,
) {
  return requestClient.get<HttpResponse<SystemDictApi.GetDictItemListResult[]>>(
    '/api/sys/dictItem/list',
    { params },
  );
}

// 新增字典项
export async function addDictItemApi(data: SystemDictApi.SaveDictItemParams) {
  return requestClient.post<string>('/api/sys/dictItem/add', data);
}

// 编辑字典项
export async function editDictItemApi(data: SystemDictApi.SaveDictItemParams) {
  return requestClient.post<string>('/api/sys/dictItem/edit', data);
}

// 删除字典项
export async function deleteDictItemApi(params: { id: string }) {
  return requestClient.delete<string>('/api/sys/dictItem/delete', {
    params,
  });
}
