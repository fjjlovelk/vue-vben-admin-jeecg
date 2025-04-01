<script setup lang="ts">
import type { VxeGridProps } from '@vben/common-ui';

import type { DictItem } from './dict.types';

import type { SystemDictApi } from '#/api';

import { ref } from 'vue';

import { Page, useVbenDrawer, useVbenVxeGrid } from '@vben/common-ui';
import { ViewTypeEnum } from '@vben/constants';

import { message, Modal } from 'ant-design-vue';

import { deleteDictItemApi, getDictItemListApi } from '#/api';

import DictItemDrawer from './dict-item-drawer.vue';
import { dictSettingColumns, dictSettingQueryFormSchema } from './dict.data';

defineOptions({
  name: 'DictSettingDrawer',
});

const formId = ref('');

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    commonConfig: {
      labelWidth: 40,
    },
    schema: dictSettingQueryFormSchema,
    wrapperClass: 'grid-cols-2',
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
          await getDictItemListApi({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            dictId: formId.value,
            ...formValues,
          }),
      },
    },
    columns: dictSettingColumns,
  } as VxeGridProps<SystemDictApi.GetDictItemListResult>,
});

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }
    const values = drawerApi.getData();
    formId.value = values.id;
  },
});

// 新增、编辑字典项
const [DictItemDrawerCom, dictItemDrawerApi] = useVbenDrawer({
  connectedComponent: DictItemDrawer,
  destroyOnClose: true,
});

// 刷新表格
const handleRefresh = () => {
  gridApi.query();
};

// 新增
const handleAdd = () => {
  dictItemDrawerApi
    .setData({ dictId: formId.value, viewType: ViewTypeEnum.ADD })
    .open();
};

// 编辑
const handleEdit = (row: SystemDictApi.GetDictItemListResult) => {
  dictItemDrawerApi
    .setData({ ...row, dictId: formId.value, viewType: ViewTypeEnum.EDIT })
    .open();
};

// 删除
const handleDelete = (row: DictItem) => {
  const key = 'delete_dict_item';
  Modal.confirm({
    title: '提示',
    content: '确认删除吗？',
    onOk() {
      const hideLoading = message.loading({
        content: '正在删除',
        duration: 0,
        key,
      });
      deleteDictItemApi({ id: row.id })
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
</script>

<template>
  <Drawer title="字典配置" class="w-[800px]" :footer="false">
    <Page auto-content-height>
      <Grid>
        <template #toolbar_buttons>
          <a-button type="primary" @click="handleAdd">新增</a-button>
        </template>
        <template #action="{ row }">
          <a-button type="link" @click="handleEdit(row)" size="small">
            编辑
          </a-button>
          <a-button type="link" danger @click="handleDelete(row)" size="small">
            删除
          </a-button>
        </template>
      </Grid>
    </Page>
    <!-- 新增、编辑字典项 -->
    <DictItemDrawerCom @success="handleRefresh" />
  </Drawer>
</template>

<style scoped></style>
