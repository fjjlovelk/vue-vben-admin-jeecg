import type {
  AntdFormProps,
  VxeGridProps,
  VxeTableGridOptions,
} from '@vben/common-ui';

import type { SystemRoleApi } from '#/api';

import { getRoleListApi } from '#/api';

// 角色列表查询表单
export const roleQueryFormConfig: AntdFormProps = {
  commonConfig: {
    labelWidth: 70,
  },
  schema: [
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
  ],
};

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

// 表格配置项
export const roleGridOptions: VxeGridProps<SystemRoleApi.GetRoleListResult> = {
  toolbarConfig: {
    slots: {
      buttons: 'toolbar_buttons',
    },
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) =>
        await getRoleListApi({
          pageNo: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        }),
    },
  },
  columns: roleColumns,
};

// 新增/编辑角色 表单
export const roleDrawerFormConfig: AntdFormProps = {
  commonConfig: {
    labelWidth: 100,
  },
  showDefaultActions: false,
  schema: [
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
  ],
};
