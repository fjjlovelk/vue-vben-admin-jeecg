import type { AntdFormSchema, VxeTableGridOptions } from '@vben/common-ui';

import type { SystemMenuApi } from '#/api/system/menu';

// 字典列表查询表单
export const dictQueryFormSchema: AntdFormSchema[] = [
  {
    component: 'Input',
    label: '字典名称',
    fieldName: 'dictName',
  },
  {
    component: 'Input',
    label: '字典编码',
    fieldName: 'dictCode',
  },
];

// 字典列表column
export const dictColumns: VxeTableGridOptions<SystemMenuApi.GetPermissionListResult>['columns'] =
  [
    { type: 'checkbox', width: 50 },
    {
      title: '字典名称',
      field: 'dictName',
      width: 240,
    },
    {
      title: '字典编码',
      field: 'dictCode',
      width: 240,
    },
    {
      title: '描述',
      field: 'description',
    },
    { title: '操作', width: 160, fixed: 'right', slots: { default: 'action' } },
  ];

// 新增/编辑字典 表单
export const dictDrawerFormSchema: AntdFormSchema[] = [
  {
    label: '字典名称',
    fieldName: 'dictName',
    rules: 'required',
    component: 'Input',
  },
  {
    label: '字典编码',
    fieldName: 'dictCode',
    rules: 'required',
    component: 'Input',
  },
  {
    label: '描述',
    fieldName: 'description',
    component: 'Input',
  },
];
