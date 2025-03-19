import type { AntdFormSchema } from '@vben/common-ui';

export const departFormSchema: AntdFormSchema[] = [
  {
    fieldName: 'departName',
    label: '机构名称',
    component: 'Input',
    rules: 'required',
    componentProps: {
      placeholder: '请输入机构/部门名称',
    },
  },
  {
    fieldName: 'parentId',
    label: '上级部门',
    component: 'TreeSelect',
    componentProps: {
      class: 'w-full',
      treeData: [],
      placeholder: '无',
      dropdownStyle: { maxHeight: '200px', overflow: 'auto' },
    },
  },
  {
    fieldName: 'orgCode',
    label: '机构编码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入机构编码',
    },
  },
  {
    fieldName: 'orgCategory',
    label: '机构类型',
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      optionType: 'button',
      options: [],
    },
  },
  {
    fieldName: 'departOrder',
    label: '排序',
    component: 'InputNumber',
    componentProps: {},
  },
  {
    fieldName: 'mobile',
    label: '电话',
    component: 'Input',
    componentProps: {
      placeholder: '请输入电话',
    },
  },
  {
    fieldName: 'fax',
    label: '传真',
    component: 'Input',
    componentProps: {
      placeholder: '请输入传真',
    },
  },
  {
    fieldName: 'address',
    label: '地址',
    component: 'Input',
    componentProps: {
      placeholder: '请输入地址',
    },
  },
  {
    fieldName: 'memo',
    label: '备注',
    component: 'Textarea',
    componentProps: {
      placeholder: '请输入备注',
    },
  },
];

// 机构类型选项
export const orgCategoryOptions = {
  // 一级部门
  root: [{ value: '1', label: '公司' }],
  // 子级部门
  child: [
    { value: '2', label: '部门' },
    { value: '3', label: '岗位' },
  ],
};
