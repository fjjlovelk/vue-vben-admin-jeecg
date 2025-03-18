<script setup lang="ts">
import type { ActionItem } from '@vben/common-ui';
import type { UserInfo } from '@vben/types';

import type { SystemMenuApi } from '#/api/system/menu';

import {
  MoreAction,
  Page,
  TableCheckTip,
  useTableCheckTip,
  useVbenDrawer,
  useVbenVxeGrid,
} from '@vben/common-ui';
import { ViewTypeEnum } from '@vben/constants';
import { IconifyIcon } from '@vben/icons';

import { message, Modal } from 'ant-design-vue';

import { deletePermissionApi } from '#/api/system/menu';

import MenuDrawer from './menu-drawer.vue';
import { menuGridOptions, menuQueryFormConfig } from './menu.data';

defineOptions({
  name: 'SystemMenu',
});

const { selectedRows, registerGridApi, handleClearCheck, onCheckboxChange } =
  useTableCheckTip<UserInfo>();

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: menuQueryFormConfig,
  gridOptions: menuGridOptions,
  gridEvents: {
    checkboxChange: onCheckboxChange,
    checkboxAll: onCheckboxChange,
  },
});
registerGridApi(gridApi);

const [MenuDrawerCom, menuDrawerApi] = useVbenDrawer({
  connectedComponent: MenuDrawer,
  destroyOnClose: true,
});

// 展开全部
const handleExpandAll = () => {
  gridApi.grid?.setAllTreeExpand(true);
};

// 折叠全部
const handleCollapseAll = () => {
  gridApi.grid?.setAllTreeExpand(false);
};

// 刷新表格
const handleRefresh = () => {
  gridApi.query();
};

// 新增菜单
const handleAdd = () => {
  menuDrawerApi.setData({ viewType: ViewTypeEnum.ADD }).open();
};

// 编辑菜单
const handleEdit = (row: SystemMenuApi.GetPermissionListResult) => {
  menuDrawerApi.setData({ ...row, viewType: ViewTypeEnum.EDIT }).open();
};

// 添加下级
const handleAddSub = (row: SystemMenuApi.GetPermissionListResult) => {
  menuDrawerApi
    .setData<
      Pick<SystemMenuApi.GetPermissionListResult, 'menuType' | 'parentId'>
    >({
      menuType: 1,
      parentId: row.id as string,
    })
    .open();
};

// 删除
const handleDelete = (row: SystemMenuApi.GetPermissionListResult) => {
  const key = 'delete_menu';
  Modal.confirm({
    title: '提示',
    content: '确认删除该菜单吗？',
    onOk() {
      const hideLoading = message.loading({
        content: '正在删除',
        duration: 0,
        key,
      });
      deletePermissionApi({ id: row.id as string })
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
const getActions = (
  row: SystemMenuApi.GetPermissionListResult,
): ActionItem[] => {
  return [
    {
      label: '添加下级',
      onClick: handleAddSub.bind(null, row),
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
        <div class="mb-[5px] w-full">
          <a-button type="primary" @click="handleAdd">新增菜单</a-button>
          <a-button type="primary" @click="handleExpandAll">展开全部</a-button>
          <a-button type="primary" @click="handleCollapseAll">
            折叠全部
          </a-button>
        </div>
        <TableCheckTip :count="selectedRows.length" @clear="handleClearCheck" />
      </template>
      <template #icon="{ row }">
        <div class="flex-center">
          <IconifyIcon v-if="row.icon" :icon="row.icon" />
        </div>
      </template>
      <template #action="{ row }">
        <a-button type="link" @click="handleEdit(row)" size="small">
          编辑
        </a-button>
        <MoreAction :actions="getActions(row)" />
      </template>
    </Grid>
    <MenuDrawerCom @success="handleRefresh" />
  </Page>
</template>

<style scoped lang="sass"></style>
