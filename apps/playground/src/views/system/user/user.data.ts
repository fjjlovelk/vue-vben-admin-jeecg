import type { DataNode, Key } from 'ant-design-vue/es/vc-tree/interface';

import type { AntdFormSchema, VxeTableGridOptions } from '@vben/common-ui';
import type { UserInfo } from '@vben/types';

import { useAccessStore } from '@vben/stores';

import {
  getDepartTreeApi,
  getDepartTreeSyncApi,
  getRoleListByTenantApi,
  getTenantListApi,
} from '#/api';

const accessStore = useAccessStore();

// 用户列表查询表单
export const userQueryFormSchema: AntdFormSchema[] = [
  {
    label: '用户账号',
    fieldName: 'username',
    component: 'Input',
  },
  {
    label: '用户姓名',
    fieldName: 'realname',
    component: 'Input',
  },
  {
    label: '手机号码',
    fieldName: 'phone',
    component: 'Input',
  },
  {
    label: '状态',
    fieldName: 'status',
    component: 'Select',
    componentProps: {
      options: accessStore.sysAllDictItems.user_status || [],
    },
  },
];

// 用户列表column
export const userColumns: VxeTableGridOptions<UserInfo>['columns'] = [
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
    title: '头像',
    field: 'avatar',
    width: 70,
    slots: { default: 'avatar' },
  },
  {
    title: '性别',
    field: 'sex_dictText',
    width: 70,
  },
  {
    title: '生日',
    field: 'birthday',
    width: 100,
  },
  {
    title: '手机号码',
    field: 'phone',
    width: 120,
  },
  {
    title: '部门',
    field: 'orgCodeTxt',
    minWidth: 150,
  },
  {
    title: '状态',
    field: 'status_dictText',
    width: 70,
  },
  { title: '操作', width: 150, fixed: 'right', slots: { default: 'action' } },
];

// 新增/编辑用户 表单
export const userDrawerFormSchema: AntdFormSchema[] = [
  {
    label: '用户账号',
    fieldName: 'username',
    rules: 'required',
    component: 'Input',
  },
  {
    label: '用户姓名',
    fieldName: 'realname',
    rules: 'required',
    component: 'Input',
  },
  {
    label: '工号',
    fieldName: 'workNo',
    rules: 'required',
    component: 'Input',
  },
  {
    label: '角色',
    fieldName: 'selectedroles',
    component: 'ApiSelect',
    componentProps: {
      api: getRoleListByTenantApi,
      labelField: 'roleName',
      valueField: 'id',
      mode: 'multiple',
      class: 'w-full',
    },
  },
  {
    label: '所属部门',
    fieldName: 'selecteddeparts',
    component: 'AsyncTreeSelect',
    componentProps: {
      fetchLabelApi: async (ids: Key[]) =>
        await getDepartTreeApi({ ids: ids.join(',') }),
      fetchTreeApi: getDepartTreeSyncApi,
      params: (data: DataNode) => ({
        pid: data?.key || undefined,
      }),
    },
  },
  {
    label: '租户',
    fieldName: 'relTenantIds',
    component: 'ApiSelect',
    componentProps: {
      api: getTenantListApi,
      labelField: 'name',
      valueField: 'id',
      mode: 'multiple',
      class: 'w-full',
    },
  },
  // {
  //   label: '头像',
  //   fieldName: 'avatar',
  //   component: 'Upload',
  // },
  {
    label: '生日',
    fieldName: 'birthday',
    component: 'DatePicker',
    componentProps: {
      class: 'w-full',
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    label: '性别',
    fieldName: 'sex',
    component: 'RadioGroup',
    componentProps: {
      options: accessStore.sysAllDictItems.sex || [],
    },
  },
  {
    label: '邮箱',
    fieldName: 'email',
    component: 'Input',
    componentProps: {
      allowClear: true,
    },
  },
  {
    label: '手机号码',
    fieldName: 'phone',
    component: 'Input',
  },
  {
    label: '座机',
    fieldName: 'telephone',
    component: 'Input',
  },
];

// 用户回收站表格column
export const userRecycleBinColumns: VxeTableGridOptions<UserInfo>['columns'] = [
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
    title: '部门',
    field: 'orgCodeTxt',
    minWidth: 150,
  },
  {
    title: '头像',
    field: 'avatar',
    width: 80,
  },
  {
    title: '性别',
    field: 'sex',
    width: 80,
  },
  { title: '操作', width: 80, fixed: 'right', slots: { default: 'action' } },
];
