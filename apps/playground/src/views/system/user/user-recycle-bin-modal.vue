<script setup lang="ts">
import type { ActionItem, VxeGridProps } from '@vben/common-ui';
import type { UserInfo } from '@vben/types';

import {
  MoreAction,
  TableCheckTip,
  useTableCheckTip,
  useVbenModal,
  useVbenVxeGrid,
} from '@vben/common-ui';

import { message, Modal } from 'ant-design-vue';

import { getRecycleUserListApi, revertBatchUserApi } from '#/api';

import { userRecycleBinColumns } from './user.data';

defineOptions({
  name: 'UserRecycleBinModal',
});

const emit = defineEmits(['success']);

const [ModalCom] = useVbenModal();

const { checkedRows, registerGridApi, handleClearCheck, onCheckboxChange } =
  useTableCheckTip<UserInfo>();

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    proxyConfig: {
      ajax: {
        query: async ({ page }) =>
          await getRecycleUserListApi({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          }),
      },
    },
    columns: userRecycleBinColumns,
  } as VxeGridProps<UserInfo>,
  gridEvents: {
    checkboxChange: onCheckboxChange,
    checkboxAll: onCheckboxChange,
  },
});
registerGridApi(gridApi);

// 取回
const handleRevert = (userIds: string) => {
  const key = 'revert_user';
  Modal.confirm({
    title: '提示',
    content: '确认取回该用户吗？',
    onOk() {
      const hideLoading = message.loading({
        content: '正在取回',
        duration: 0,
        key,
      });
      revertBatchUserApi({ userIds })
        .then(() => {
          message.success({
            content: '取回成功',
            key,
          });
          emit('success');
        })
        .finally(() => {
          hideLoading();
        });
    },
  });
};

// 批量取回
const handleRevertBatch = () => {
  if (checkedRows.value.length === 0) {
    return;
  }
  const key = 'revert_batch_user';
  Modal.confirm({
    title: '提示',
    content: '确认取回选中用户吗？',
    onOk() {
      const hideLoading = message.loading({
        content: '正在取回',
        duration: 0,
        key,
      });
      const userIds = checkedRows.value.map((row) => row.id).join(',');
      revertBatchUserApi({ userIds })
        .then(() => {
          message.success({
            content: '取回成功',
            key,
          });
          emit('success');
        })
        .finally(() => {
          hideLoading();
        });
    },
  });
};

// 批量按鈕
const getBatchActions = (): ActionItem[] => {
  return [
    {
      label: '批量取回',
      onClick: handleRevertBatch.bind(null),
    },
  ];
};
</script>

<template>
  <ModalCom title="用户回收站" fullscreen :show-confirm-button="false">
    <Grid>
      <template #toolbar-actions>
        <div class="mb-[5px] w-full">
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
      <template #avatar="{ row }">
        <a-avatar v-if="row.avatar" :src="row.avatar" />
      </template>
      <template #action="{ row }">
        <a-button type="link" @click="handleRevert(row.id)" size="small">
          取回
        </a-button>
      </template>
    </Grid>
  </ModalCom>
</template>

<style scoped></style>
