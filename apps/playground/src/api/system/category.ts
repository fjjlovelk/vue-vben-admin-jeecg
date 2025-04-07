import type { HttpPage, HttpResponse } from '@vben/request';
import type { BasicRecord } from '@vben/types';

import type { Category } from '#/views/system/category/category.types.ts';

import { requestClient } from '#/api/request';

export namespace SystemCategoryApi {
  export interface GetCategoryListParams {
    name: string;
  }
  export interface GetCategoryTreeListParams {
    async: boolean;
    pcode: string;
  }
  export interface GetCategoryListResult extends BasicRecord, Category {}
  export interface GetCategoryTreeListResult {
    children: SystemCategoryApi.GetCategoryTreeListResult[];
    code: string;
    icon: null | string;
    key: string;
    leaf: boolean;
    parentId: string;
    title: string;
    value: null | string;
  }
}

// 获取分类字典根列表
export async function getCategoryRootListApi(
  params?: SystemCategoryApi.GetCategoryListParams,
) {
  return requestClient.get<HttpPage<SystemCategoryApi.GetCategoryListResult>>(
    '/api/sys/category/rootList',
    {
      params,
    },
  );
}

// 根据pid获取子分类字典列表
export async function getCategoryChildListApi(params: { pid: string }) {
  return requestClient.get<SystemCategoryApi.GetCategoryListResult>(
    '/api/sys/category/childList',
    {
      params,
    },
  );
}

// 获取分类字典树形列表
export async function getCategoryTreeListApi(
  params?: SystemCategoryApi.GetCategoryTreeListParams,
) {
  return requestClient.get<
    HttpResponse<SystemCategoryApi.GetCategoryTreeListResult>
  >('/api/sys/category/loadTreeRoot', {
    params,
    responseReturn: 'body',
  });
}

// 新增分类字典
export async function addCategoryApi(data: Partial<Category>) {
  return requestClient.post<string>('/api/sys/category/add', data);
}

// 编辑分类字典
export async function editCategoryApi(data: Partial<Category>) {
  return requestClient.post<string>('/api/sys/category/edit', data);
}

// 删除分类字典
export async function deleteCategoryApi(params: { id: string }) {
  return requestClient.delete<string>('/api/sys/category/delete', {
    params,
  });
}

// 批量删除分类字典
export async function deleteBatchCategoryApi(params: { ids: string }) {
  return requestClient.delete<string>('/api/sys/category/deleteBatch', {
    params,
  });
}
