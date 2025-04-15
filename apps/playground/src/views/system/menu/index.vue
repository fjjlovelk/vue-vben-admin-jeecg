<script setup lang="ts">
import type { ActionItem, VxeGridProps } from '@vben/common-ui';
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

import {
  deleteBatchPermissionApi,
  deletePermissionApi,
  getPermissionListApi,
} from '#/api/system/menu';

import MenuDrawer from './menu-drawer.vue';
import { menuColumns, menuQueryFormSchema } from './menu.data';

defineOptions({
  name: 'SystemMenu',
});

const { checkedRows, registerGridApi, handleClearCheck, onCheckboxChange } =
  useTableCheckTip<UserInfo>();

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: menuQueryFormSchema,
  },
  gridOptions: {
    keepSource: true,
    treeConfig: {},
    pagerConfig: {
      enabled: false,
    },
    checkboxConfig: {
      reserve: true,
      checkStrictly: true,
      showHeader: true,
    },
    proxyConfig: {
      ajax: {
        query: async (_, formValues) => {
          const { result } = await getPermissionListApi(formValues);
          return result;
        },
      },
    },
    columns: menuColumns,
  } as VxeGridProps<SystemMenuApi.GetPermissionListResult>,
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

// 删除
const handleDeleteBatch = () => {
  if (checkedRows.value.length === 0) {
    return;
  }
  const key = 'delete_batch_menu';
  Modal.confirm({
    title: '提示',
    content: '确认删除选中菜单吗？',
    onOk() {
      const hideLoading = message.loading({
        content: '正在删除',
        duration: 0,
        key,
      });
      const ids = checkedRows.value.map((row) => row.id).join(',');
      deleteBatchPermissionApi({ ids })
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

// 批量按鈕
const getBatchActions = (): ActionItem[] => {
  return [
    {
      label: '删除',
      danger: true,
      onClick: handleDeleteBatch.bind(null),
    },
  ];
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <div class="mb-[5px] w-full">
          <a-button type="primary" @click="handleAdd">新增菜单</a-button>
          <a-button type="primary" @click="handleExpandAll">展开全部</a-button>
          <a-button type="primary" @click="handleCollapseAll">
            折叠全部
          </a-button>
          <MoreAction
            v-if="checkedRows.length > 0"
            type="default"
            size="normal"
            content="批量操作"
            :actions="getBatchActions()"
          />
        </div>
        <TableCheckTip :count="checkedRows.length" @clear="handleClearCheck" />
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
