<script setup lang="ts">
import type { VxeGridProps } from '@vben/common-ui';
import type { UserInfo } from '@vben/types';

import {
  TableCheckTip,
  useTableCheckTip,
  useVbenModal,
  useVbenVxeGrid,
} from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { getUserListApi } from '#/api';

import { userSelectColumns, userSelectQueryFormSchema } from './user.data';

defineOptions({
  name: 'UserSelectModal',
});

const emit = defineEmits(['ok']);

const { checkedRows, registerGridApi, handleClearCheck, onCheckboxChange } =
  useTableCheckTip<UserInfo>();

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    commonConfig: {
      labelWidth: 70,
    },
    schema: userSelectQueryFormSchema,
    wrapperClass: 'grid-cols-2',
  },
  gridOptions: {
    height: 500,
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
    columns: userSelectColumns,
  } as VxeGridProps<UserInfo>,
  gridEvents: {
    checkboxChange: onCheckboxChange,
    checkboxAll: onCheckboxChange,
  },
});
registerGridApi(gridApi);

const [ModalCom, { close }] = useVbenModal({
  onConfirm() {
    if (checkedRows.value.length === 0) {
      message.warn('请选择用户');
      return;
    }
    emit('ok', checkedRows.value);
    close();
  },
});
</script>

<template>
  <ModalCom title="用户选择" class="w-[700px]">
    <Grid>
      <template #toolbar-actions>
        <TableCheckTip :count="checkedRows.length" @clear="handleClearCheck" />
      </template>
    </Grid>
  </ModalCom>
</template>

<style scoped></style>
