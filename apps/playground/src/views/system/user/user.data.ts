import type { AntdFormProps, VxeTableGridOptions } from '@vben/common-ui';
import type { UserInfo } from '@vben/types';

import { useAccessStore } from '@vben/stores';

import { getRoleListByTenantApi, getTenantListApi } from '#/api';

const accessStore = useAccessStore();

// 用户列表查询表单
export const userQueryFormConfig: AntdFormProps = {
  commonConfig: {
    labelWidth: 70,
  },
  schema: [
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
  ],
};

// 用户列表column
export const userColumns: VxeTableGridOptions<UserInfo>['columns'] = [
  {
    title: '用户账号',
    field: 'username',
  },
  {
    title: '用户姓名',
    field: 'realname',
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
    width: 100,
  },
  {
    title: '部门',
    field: 'orgCodeTxt',
  },
  {
    title: '状态',
    field: 'status_dictText',
    width: 70,
  },
  { title: '操作', width: 200, fixed: 'right', slots: { default: 'action' } },
];

// 新增/编辑用户 表单
export const userDrawerFormConfig: AntdFormProps = {
  commonConfig: {
    labelWidth: 100,
  },
  showDefaultActions: false,
  schema: [
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
      component: 'Select',
      componentProps: {
        options: accessStore.sysAllDictItems.sex || [],
        class: 'w-full',
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
  ],
};
