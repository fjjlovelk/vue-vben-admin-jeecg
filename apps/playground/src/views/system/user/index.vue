<script setup lang="ts">
import type { ActionItem, VxeGridProps } from '@vben/common-ui';
import type { UserInfo } from '@vben/types';

import {
  MoreAction,
  Page,
  useVbenDrawer,
  useVbenVxeGrid,
} from '@vben/common-ui';
import { ViewType } from '@vben/constants';

import { message, Modal } from 'ant-design-vue';

import { deleteUserApi, getUserListApi } from '#/api';

import UserDrawer from './user-drawer.vue';
import { userColumns, userQueryFormConfig } from './user.data';

defineOptions({
  name: 'SystemUser',
});

const gridOptions: VxeGridProps<UserInfo> = {
  keepSource: true,
  toolbarConfig: {
    slots: {
      buttons: 'toolbar_buttons',
    },
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) =>
        await getUserListApi({
          pageNo: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        }),
    },
  },
  columns: userColumns,
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: userQueryFormConfig,
  gridOptions,
});

// 新增、编辑用户
const [UserDrawerCom, userDrawerApi] = useVbenDrawer({
  connectedComponent: UserDrawer,
  destroyOnClose: true,
});

// 表格内部更多按钮
function getActions(row: UserInfo): ActionItem[] {
  return [
    {
      label: '详情',
      onClick: handleView.bind(null, row),
    },
    {
      label: '删除',
      danger: true,
      onClick: handleDelete.bind(null, row),
    },
  ];
}

// 刷新表格
function handleRefresh() {
  gridApi.query();
}

// 新增用户
function handleAdd() {
  userDrawerApi.setData({ viewType: ViewType.Add }).open();
}

// 编辑用户
function handleEdit(row: UserInfo) {
  userDrawerApi.setData({ ...row, viewType: ViewType.Edit }).open();
}

// 查看用户
function handleView(row: UserInfo) {
  userDrawerApi.setData({ ...row, viewType: ViewType.View }).open();
}

// 删除
function handleDelete(row: UserInfo) {
  Modal.confirm({
    title: '提示',
    content: '确认删除该用户吗？',
    onOk() {
      const hideLoading = message.loading({
        content: '正在删除',
        duration: 0,
        key: 'action_process_msg',
      });
      deleteUserApi({ id: row.id as string })
        .then(() => {
          message.success({
            content: '删除成功',
            key: 'action_process_msg',
          });
          handleRefresh();
        })
        .finally(() => {
          hideLoading();
        });
    },
  });
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar_buttons>
        <a-button type="primary" @click="handleAdd">新增用户</a-button>
      </template>
      <template #avatar="{ row }">
        <a-avatar v-if="row.avatar" :src="row.avatar" />
      </template>
      <template #action="{ row }">
        <a-button type="link" @click="handleEdit(row)" size="small">
          编辑
        </a-button>
        <MoreAction :actions="getActions(row)" />
      </template>
    </Grid>
    <UserDrawerCom @success="handleRefresh" />
  </Page>
</template>

<style scoped lang="sass"></style>
