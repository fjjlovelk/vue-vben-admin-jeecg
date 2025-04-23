import type { DataNode, Key } from 'ant-design-vue/es/vc-tree/interface';

import type { AntdFormSchema, VxeTableGridOptions } from '@vben/common-ui';
import type { UserInfo } from '@vben/types';

import type { SystemRoleApi } from '#/api';

import { z } from '@vben/common-ui';
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
      modalTitle: '所属部门',
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
  {
    label: '头像',
    fieldName: 'avatar',
    component: 'ImageUpload',
    componentProps: {
      name: 'file',
      action: '/upload-api/sys/common/upload',
      headers: {
        'X-Access-Token': accessStore.accessToken,
      },
      data: () => ({
        biz: 'temp',
      }),
    },
  },
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

// 用户选择查询条件
export const userSelectQueryFormSchema: AntdFormSchema[] = [
  {
    component: 'Input',
    label: '用户账号',
    fieldName: 'username',
  },
];

// 用户选择列表column
export const userSelectColumns: VxeTableGridOptions<SystemRoleApi.GetRoleListResult>['columns'] =
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
  ];

// 修改密码schema
export const userPasswordModalFormSchema: AntdFormSchema[] = [
  {
    component: 'Input',
    label: '用户账号',
    fieldName: 'username',
    disabled: true,
  },
  {
    component: 'InputPassword',
    label: '登录密码',
    fieldName: 'password',
    rules: z
      .string()
      .min(1, { message: '密码不能为空!' })
      .refine(
        (val) =>
          /^(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/i.test(
            val,
          ),
        {
          message: '密码由8位数字、大小写字母和特殊符号组成!',
        },
      ),
  },
  {
    component: 'InputPassword',
    label: '确认新密码',
    fieldName: 'confirmPassword',
    dependencies: {
      triggerFields: ['password'],
      rules: (values) =>
        z
          .string()
          .nullish()
          .refine((val) => !!val, {
            message: '密码不能为空!',
          })
          .refine((val) => val === values.password, {
            message: '两次输入的密码不一致!',
          }),
    },
  },
];
