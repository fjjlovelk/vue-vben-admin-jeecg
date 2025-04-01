import type { AntdFormSchema, VxeTableGridOptions } from '@vben/common-ui';

import type { SystemMenuApi } from '#/api/system/menu';

import { useAccessStore } from '@vben/stores';

const accessStore = useAccessStore();

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
    { title: '操作', width: 180, fixed: 'right', slots: { default: 'action' } },
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

// 字典配置查询表单
export const dictSettingQueryFormSchema: AntdFormSchema[] = [
  {
    component: 'Input',
    label: '名称',
    fieldName: 'itemText',
  },
  {
    component: 'Select',
    label: '状态',
    fieldName: 'status',
    componentProps: {
      options: accessStore.sysAllDictItems.dict_item_status || [],
    },
  },
];

// 字典配置列表column
export const dictSettingColumns: VxeTableGridOptions<SystemMenuApi.GetPermissionListResult>['columns'] =
  [
    {
      title: '名称',
      field: 'itemText',
    },
    {
      title: '数据值',
      field: 'itemValue',
    },
    { title: '操作', width: 120, fixed: 'right', slots: { default: 'action' } },
  ];

// 新增/编辑字典项 表单
export const dictItemDrawerFormSchema: AntdFormSchema[] = [
  {
    label: '名称',
    fieldName: 'itemText',
    rules: 'required',
    component: 'Input',
  },
  {
    label: '数据值',
    fieldName: 'itemValue',
    rules: 'required',
    component: 'Input',
  },
  {
    label: '颜色值',
    fieldName: 'itemColor',
    component: 'Input',
  },
  {
    label: '描述',
    fieldName: 'description',
    component: 'Input',
  },
  {
    label: '排序',
    fieldName: 'sortOrder',
    component: 'InputNumber',
    defaultValue: 1,
  },
  {
    label: '是否启用',
    fieldName: 'status',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: (accessStore.sysAllDictItems.dict_item_status || []).map(
        (item) => ({ ...item, value: Number.parseInt(item.value) }),
      ),
    },
  },
];
