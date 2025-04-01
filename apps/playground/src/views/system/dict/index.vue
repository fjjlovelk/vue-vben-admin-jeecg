<script setup lang="ts">
import type { ActionItem, VxeGridProps } from '@vben/common-ui';
import type { UserInfo } from '@vben/types';

import type { SystemDictApi } from '#/api';

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

import { deleteBatchDictApi, deleteDictApi, getDictListApi } from '#/api';

import DictDrawer from './dict-drawer.vue';
import DictSettingDrawer from './dict-setting-drawer.vue';
import { dictColumns, dictQueryFormSchema } from './dict.data';

defineOptions({
  name: 'SystemDict',
});

const { checkedRows, registerGridApi, handleClearCheck, onCheckboxChange } =
  useTableCheckTip<UserInfo>();

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    commonConfig: {
      labelWidth: 70,
    },
    schema: dictQueryFormSchema,
  },
  gridOptions: {
    checkboxConfig: {
      reserve: true,
      checkStrictly: true,
      showHeader: true,
    },
    toolbarConfig: {
      slots: {
        buttons: 'toolbar_buttons',
      },
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) =>
          await getDictListApi({
            column: 'createTime',
            order: 'desc',
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          }),
      },
    },
    columns: dictColumns,
  } as VxeGridProps<SystemDictApi.GetDictListResult>,
  gridEvents: {
    checkboxChange: onCheckboxChange,
    checkboxAll: onCheckboxChange,
  },
});
registerGridApi(gridApi);

const [DictDrawerCom, dictDrawerApi] = useVbenDrawer({
  connectedComponent: DictDrawer,
  destroyOnClose: true,
});
const [DictSettingCom, dictSettingDrawerApi] = useVbenDrawer({
  connectedComponent: DictSettingDrawer,
  destroyOnClose: true,
});

// 刷新表格
const handleRefresh = () => {
  gridApi.query();
};

// 新增字典
const handleAdd = () => {
  dictDrawerApi.setData({ viewType: ViewTypeEnum.ADD }).open();
};

// 编辑字典
const handleEdit = (row: SystemDictApi.GetDictListResult) => {
  dictDrawerApi.setData({ ...row, viewType: ViewTypeEnum.EDIT }).open();
};

// 字典配置
const handleSetting = (row: SystemDictApi.GetDictListResult) => {
  dictSettingDrawerApi.setData({ ...row }).open();
};

// 删除
const handleDelete = (row: SystemDictApi.GetDictListResult) => {
  const key = 'delete_dict';
  Modal.confirm({
    title: '提示',
    content: '确认删除该字典吗？',
    onOk() {
      const hideLoading = message.loading({
        content: '正在删除',
        duration: 0,
        key,
      });
      deleteDictApi({ id: row.id as string })
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
  const key = 'delete_batch_dict';
  Modal.confirm({
    title: '提示',
    content: '确认删除选中字典吗？',
    onOk() {
      const hideLoading = message.loading({
        content: '正在删除',
        duration: 0,
        key,
      });
      const ids = checkedRows.value.map((row) => row.id).join(',');
      deleteBatchDictApi({ ids })
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
const getActions = (row: SystemDictApi.GetDictListResult): ActionItem[] => {
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
      <template #toolbar_buttons>
        <div class="mb-[5px] w-full">
          <a-button type="primary" @click="handleAdd">新增字典</a-button>
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
        <a-button type="link" @click="handleSetting(row)" size="small">
          字典配置
        </a-button>
        <MoreAction :actions="getActions(row)" />
      </template>
    </Grid>
    <!-- 新增、编辑字典 -->
    <DictDrawerCom @success="handleRefresh" />
    <!-- 字典配置 -->
    <DictSettingCom />
  </Page>
</template>

<style scoped lang="sass"></style>
