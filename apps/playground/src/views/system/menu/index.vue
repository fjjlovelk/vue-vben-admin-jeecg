<script setup lang="ts">
import type { ActionItem, AntdFormProps, VxeGridProps } from '@vben/common-ui';

import type { SystemMenuApi } from '#/api/system/menu';

import {
  MoreAction,
  Page,
  useVbenDrawer,
  useVbenVxeGrid,
} from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { message } from 'ant-design-vue';

import { deletePermissionApi, getPermissionListApi } from '#/api/system/menu';
import { menuColumns } from '#/views/system/menu/data';

import MenuDrawer from './menu-drawer.vue';

defineOptions({
  name: 'Menu',
});

const formOptions: AntdFormProps = {
  schema: [
    {
      component: 'Input',
      label: '菜单名称',
      fieldName: 'name',
    },
  ],
};

const gridOptions: VxeGridProps<SystemMenuApi.GetPermissionListResult> = {
  keepSource: true,
  treeConfig: {},
  pagerConfig: {
    enabled: false,
  },
  toolbarConfig: {
    slots: {
      buttons: 'toolbar_buttons',
    },
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
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [Drawer, drawerApi] = useVbenDrawer({
  connectedComponent: MenuDrawer,
  destroyOnClose: true,
});

function getActions(row: SystemMenuApi.GetPermissionListResult): ActionItem[] {
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
}

function handleRefresh() {
  gridApi.query();
}

// 新增菜单
function handleAdd() {
  drawerApi.open();
}

// 编辑菜单
function handleEdit(row: SystemMenuApi.GetPermissionListResult) {
  drawerApi.setData<SystemMenuApi.GetPermissionListResult>(row).open();
}

// 添加下级
function handleAddSub(row: SystemMenuApi.GetPermissionListResult) {
  drawerApi
    .setData<
      Pick<SystemMenuApi.GetPermissionListResult, 'menuType' | 'parentId'>
    >({
      menuType: 1,
      parentId: row.id as string,
    })
    .open();
}

// 删除
function handleDelete(row: SystemMenuApi.GetPermissionListResult) {
  const hideLoading = message.loading({
    content: '正在删除',
    duration: 0,
    key: 'action_process_msg',
  });
  deletePermissionApi({ id: row.id as string })
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
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar_buttons>
        <a-button type="primary" @click="handleAdd">新增菜单</a-button>
        <a-button type="primary">展开全部</a-button>
        <a-button type="primary">折叠全部</a-button>
      </template>
      <template #icon="{ row }">
        <div class="flex-center">
          <IconifyIcon :icon="row.icon" />
        </div>
      </template>
      <template #action="{ row }">
        <a-button type="link" @click="handleEdit(row)">编辑</a-button>
        <MoreAction :actions="getActions(row)" />
      </template>
    </Grid>
    <Drawer @success="handleRefresh" />
  </Page>
</template>

<style scoped lang="sass"></style>
