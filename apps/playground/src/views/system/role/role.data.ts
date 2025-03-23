import type { AntdFormSchema, VxeTableGridOptions } from '@vben/common-ui';

import type { SystemRoleApi } from '#/api';

// 角色列表查询表单
export const roleQueryFormSchema: AntdFormSchema[] = [
  {
    component: 'Input',
    label: '角色名称',
    fieldName: 'roleName',
  },
  {
    component: 'Input',
    label: '角色编码',
    fieldName: 'roleCode',
  },
];

// 角色列表column
export const roleColumns: VxeTableGridOptions<SystemRoleApi.GetRoleListResult>['columns'] =
  [
    {
      title: '角色名称',
      field: 'roleName',
      minWidth: 150,
    },
    {
      title: '角色编码',
      field: 'roleCode',
      minWidth: 150,
    },
    {
      title: '备注',
      field: 'description',
      minWidth: 150,
    },
    {
      title: '创建时间',
      field: 'createTime',
      width: 160,
    },
    { title: '操作', width: 200, fixed: 'right', slots: { default: 'action' } },
  ];

// 新增/编辑角色 表单
export const roleDrawerFormSchema: AntdFormSchema[] = [
  {
    label: '角色名称',
    fieldName: 'roleName',
    rules: 'required',
    component: 'Input',
  },
  {
    label: '角色编码',
    fieldName: 'roleCode',
    rules: 'required',
    component: 'Input',
  },
  {
    label: '备注',
    fieldName: 'description',
    component: 'Textarea',
  },
];

// 角色用户列表查询表单
export const roleUserQueryFormSchema: AntdFormSchema[] = [
  {
    component: 'Input',
    label: '用户账号',
    fieldName: 'username',
  },
];

// 角色用户列表column
export const roleUserColumns: VxeTableGridOptions<SystemRoleApi.GetRoleListResult>['columns'] =
  [
    { type: 'checkbox', width: 50 },
    {
      title: '用户账号',
      field: 'username',
      minWidth: 150,
    },
    {
      title: '用户姓名',
      field: 'realname',
      minWidth: 150,
    },
    {
      title: '状态',
      field: 'status_dictText',
      width: 80,
    },
    { title: '操作', width: 100, fixed: 'right', slots: { default: 'action' } },
  ];
