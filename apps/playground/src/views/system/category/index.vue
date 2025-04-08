<script setup lang="ts">
import type { ActionItem, VxeGridProps } from '@vben/common-ui';
import type { UserInfo } from '@vben/types';

import type { SystemCategoryApi } from '#/api/system/category';

import {
  MoreAction,
  Page,
  TableCheckTip,
  useTableCheckTip,
  useVbenDrawer,
  useVbenVxeGrid,
} from '@vben/common-ui';
import { ViewTypeEnum } from '@vben/constants';

import { message, Modal } from 'ant-design-vue';

import {
  deleteBatchCategoryApi,
  deleteCategoryApi,
  getCategoryChildListApi,
  getCategoryRootListApi,
} from '#/api/system/category';

import CategoryDrawer from './category-drawer.vue';
import { categoryColumns, categoryQueryFormSchema } from './category.data';

defineOptions({
  name: 'SystemCategory',
});

const { checkedRows, registerGridApi, handleClearCheck, onCheckboxChange } =
  useTableCheckTip<UserInfo>();

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    commonConfig: {
      labelWidth: 40,
    },
    schema: categoryQueryFormSchema,
  },
  gridOptions: {
    keepSource: true,
    treeConfig: {
      lazy: true,
      hasChildField: 'hasChild',
      loadMethod: ({ row }) => getCategoryChildListApi({ pid: row.id }),
    },
    pagerConfig: {
      enabled: false,
    },
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
        query: async (_, formValues) => {
          const { records = [] } = await getCategoryRootListApi({
            column: 'createTime',
            order: 'desc',
            ...formValues,
          });
          return records;
        },
      },
    },
    columns: categoryColumns,
  } as VxeGridProps<SystemCategoryApi.GetCategoryListResult>,
  gridEvents: {
    checkboxChange: onCheckboxChange,
    checkboxAll: onCheckboxChange,
  },
});
registerGridApi(gridApi);

const [CategoryDrawerCom, menuDrawerApi] = useVbenDrawer({
  connectedComponent: CategoryDrawer,
  destroyOnClose: true,
});

// 刷新表格
const handleRefresh = () => {
  gridApi.query();
};

// 新增分类字典
const handleAdd = () => {
  menuDrawerApi.setData({ viewType: ViewTypeEnum.ADD }).open();
};

// 编辑分类字典
const handleEdit = (row: SystemCategoryApi.GetCategoryListResult) => {
  menuDrawerApi.setData({ ...row, viewType: ViewTypeEnum.EDIT }).open();
};

// 添加下级
const handleAddSub = (row: SystemCategoryApi.GetCategoryListResult) => {
  menuDrawerApi
    .setData<Pick<SystemCategoryApi.GetCategoryListResult, 'pid'>>({
      pid: row.id as string,
    })
    .open();
};

// 删除
const handleDelete = (row: SystemCategoryApi.GetCategoryListResult) => {
  const key = 'delete_menu';
  Modal.confirm({
    title: '提示',
    content: '确认删除该分类字典吗？',
    onOk() {
      const hideLoading = message.loading({
        content: '正在删除',
        duration: 0,
        key,
      });
      deleteCategoryApi({ id: row.id as string })
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
    content: '确认删除选中分类字典吗？',
    onOk() {
      const hideLoading = message.loading({
        content: '正在删除',
        duration: 0,
        key,
      });
      const ids = checkedRows.value.map((row) => row.id).join(',');
      deleteBatchCategoryApi({ ids })
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
  row: SystemCategoryApi.GetCategoryListResult,
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
      <template #toolbar_buttons>
        <div class="mb-[5px] w-full">
          <a-button type="primary" @click="handleAdd">新增分类字典</a-button>
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
      <template #action="{ row }">
        <a-button type="link" @click="handleEdit(row)" size="small">
          编辑
        </a-button>
        <MoreAction :actions="getActions(row)" />
      </template>
    </Grid>
    <CategoryDrawerCom @success="handleRefresh" />
  </Page>
</template>

<style scoped lang="sass"></style>
