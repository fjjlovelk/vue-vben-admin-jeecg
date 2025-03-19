<script setup lang="ts">
import type { ActionItem, VxeGridProps } from '@vben/common-ui';

import type { SystemRoleApi } from '#/api';

import {
  MoreAction,
  Page,
  useVbenDrawer,
  useVbenVxeGrid,
} from '@vben/common-ui';
import { ViewTypeEnum } from '@vben/constants';

import { message, Modal } from 'ant-design-vue';

import { deleteRoleApi, getRoleListApi } from '#/api';

import RoleDrawer from './role-drawer.vue';
import RolePermissionDrawer from './role-permission-drawer.vue';
import { roleColumns, roleQueryFormSchema } from './role.data';

defineOptions({
  name: 'SystemRole',
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    commonConfig: {
      labelWidth: 70,
    },
    schema: roleQueryFormSchema,
  },
  gridOptions: {
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
  } as VxeGridProps<SystemRoleApi.GetRoleListResult>,
});

// 新增、编辑角色
const [RoleDrawerCom, roleDrawerApi] = useVbenDrawer({
  connectedComponent: RoleDrawer,
  destroyOnClose: true,
});

// 授权
const [RolePermissionDrawerCom, rolePermissionDrawerApi] = useVbenDrawer({
  connectedComponent: RolePermissionDrawer,
  destroyOnClose: true,
});

// 刷新表格
const handleRefresh = () => {
  gridApi.query();
};

// 新增角色
const handleAdd = () => {
  roleDrawerApi.setData({ viewType: ViewTypeEnum.ADD }).open();
};

// 授权
const handlePermission = (row: SystemRoleApi.GetRoleListResult) => {
  rolePermissionDrawerApi.setData(row).open();
};

// 编辑角色
const handleEdit = (row: SystemRoleApi.GetRoleListResult) => {
  roleDrawerApi.setData({ ...row, viewType: ViewTypeEnum.EDIT }).open();
};

// 删除
const handleDelete = (row: SystemRoleApi.GetRoleListResult) => {
  const key = 'delete_role';
  Modal.confirm({
    title: '提示',
    content: '确认删除该角色吗？',
    onOk() {
      const hideLoading = message.loading({
        content: '正在删除',
        duration: 0,
        key,
      });
      deleteRoleApi({ id: row.id as string })
        .then(() => {
          message.success({
            content: '删除成功',
            key,
          });
          handleRefresh();
        })
        .finally(() => {
          hideLoading();
        });
    },
  });
};

// 表格内部更多按钮
const getActions = (row: SystemRoleApi.GetRoleListResult): ActionItem[] => {
  return [
    {
      label: '编辑',
      onClick: handleEdit.bind(null, row),
    },
    {
      label: '删除',
      danger: true,
      onClick: handleDelete.bind(null, row),
    },
  ];
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar_buttons>
        <a-button type="primary" @click="handleAdd">新增角色</a-button>
      </template>
      <template #action="{ row }">
        <a-button type="link" @click="handleEdit(row)" size="small">
          用户
        </a-button>
        <a-button type="link" @click="handlePermission(row)" size="small">
          授权
        </a-button>
        <MoreAction :actions="getActions(row)" />
      </template>
    </Grid>
    <RoleDrawerCom @success="handleRefresh" />
    <RolePermissionDrawerCom />
  </Page>
</template>

<style scoped lang="sass"></style>
