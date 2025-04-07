import type { AntdFormSchema, VxeTableGridOptions } from '@vben/common-ui';

import type { SystemCategoryApi } from '#/api/system/category';

import { getCategoryTreeListApi } from '#/api/system/category';

// 分类字典列表查询表单
export const categoryQueryFormSchema: AntdFormSchema[] = [
  {
    component: 'Input',
    label: '名称',
    fieldName: 'name',
  },
  {
    component: 'Input',
    label: '编码',
    fieldName: 'code',
  },
];

// 分类字典列表column
export const categoryColumns: VxeTableGridOptions<SystemCategoryApi.GetCategoryListResult>['columns'] =
  [
    { type: 'checkbox', width: 50 },
    {
      title: '分类字典名称',
      field: 'name',
      treeNode: true,
      align: 'left',
      headerAlign: 'center',
    },
    { title: '分类字典编码', field: 'code' },
    { title: '操作', width: 160, fixed: 'right', slots: { default: 'action' } },
  ];

// 新增/编辑分类字典 表单
export const categoryDrawerFormSchema: AntdFormSchema[] = [
  {
    label: '',
    fieldName: 'id',
    component: 'Input',
    dependencies: {
      triggerFields: ['any'],
      show: false,
    },
  },
  {
    label: '父级节点',
    fieldName: 'pid',
    component: 'ApiTreeSelect',
    componentProps: {
      api: async () => {
        const { result } = await getCategoryTreeListApi({
          async: false,
          pcode: '',
        });
        return result;
      },
      class: 'w-full',
      labelField: 'title',
      valueField: 'key',
      childrenField: 'children',
    },
    dependencies: {
      triggerFields: ['id'],
      show: (value) => value.pid !== '0',
      disabled: (value) => !!value.id,
    },
  },
  {
    label: '分类字典名称',
    fieldName: 'name',
    rules: 'required',
    component: 'Input',
  },
  {
    label: '分类字典编码',
    fieldName: 'code',
    rules: 'required',
    component: 'Input',
  },
];
