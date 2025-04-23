<script setup lang="ts">
import type { ActionItem, VxeGridProps } from '@vben/common-ui';
import type { UserInfo } from '@vben/types';

import type { SystemUserApi } from '#/api';

import {
  MoreAction,
  Page,
  TableCheckTip,
  useTableCheckTip,
  useVbenDrawer,
  useVbenModal,
  useVbenVxeGrid,
} from '@vben/common-ui';
import { ViewTypeEnum } from '@vben/constants';

import { message, Modal } from 'ant-design-vue';

import {
  deleteBatchUserApi,
  deleteUserApi,
  freezeBatchUserApi,
  getUserListAllApi,
} from '#/api';

import UserDrawer from './user-drawer.vue';
import UserPasswordModal from './user-password-modal.vue';
import UserRecycleBinModal from './user-recycle-bin-modal.vue';
import { userColumns, userQueryFormSchema } from './user.data';

defineOptions({
  name: 'SystemUser',
});

const { checkedRows, registerGridApi, handleClearCheck, onCheckboxChange } =
  useTableCheckTip<UserInfo>();

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    commonConfig: {
      labelWidth: 70,
    },
    schema: userQueryFormSchema,
  },
  gridOptions: {
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) =>
          await getUserListAllApi({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          }),
      },
    },
    columns: userColumns,
  } as VxeGridProps<SystemUserApi.GetUserListParams>,
  gridEvents: {
    checkboxChange: onCheckboxChange,
    checkboxAll: onCheckboxChange,
  },
});
registerGridApi(gridApi);

// 新增、编辑用户
const [UserDrawerCom, userDrawerApi] = useVbenDrawer({
  connectedComponent: UserDrawer,
  destroyOnClose: true,
});

// 修改密码
const [UserPasswordModalCom, userPasswordApi] = useVbenModal({
  connectedComponent: UserPasswordModal,
  destroyOnClose: true,
});

// 回收站
const [UserRecycleBinModalCom, userRecycleBinModalApi] = useVbenModal({
  connectedComponent: UserRecycleBinModal,
  destroyOnClose: true,
});

// 刷新表格
const handleRefresh = () => {
  gridApi.query();
};

// 打开回收站
const handleOpenRecycleBinModal = () => {
  userRecycleBinModalApi.open();
};

// 新增用户
const handleAdd = () => {
  userDrawerApi.setData({ viewType: ViewTypeEnum.ADD }).open();
};

// 编辑用户
const handleEdit = (row: UserInfo) => {
  userDrawerApi.setData({ ...row, viewType: ViewTypeEnum.EDIT }).open();
};

// 查看用户
const handleView = (row: UserInfo) => {
  userDrawerApi
    .setState({ footer: false })
    .setData({ ...row, viewType: ViewTypeEnum.VIEW })
    .open();
};

// 修改密码
const handleUserPassword = (row: UserInfo) => {
  userPasswordApi.setData(row).open();
};

// 冻结/解冻
const handleFreeze = (row: UserInfo, status: UserInfo['status']) => {
  const tip = status === 1 ? '冻结' : '解冻';
  const key = status === 1 ? 'freeze_user' : 'unfreeze_user';
  Modal.confirm({
    title: '提示',
    content: `确认${tip}该用户吗？`,
    onOk() {
      const hideLoading = message.loading({
        content: `正在${tip}`,
        duration: 0,
        key,
      });
      freezeBatchUserApi({ ids: row.id as string, status })
        .then(() => {
          message.success({
            content: `${tip}成功`,
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

// 批量冻结/解冻
const handleFreezeBatch = (status: UserInfo['status']) => {
  if (checkedRows.value.length === 0) {
    return;
  }
  const tip = status === 1 ? '冻结' : '解冻';
  const key = status === 1 ? 'freeze_batch_user' : 'unfreeze_batch_user';
  Modal.confirm({
    title: '提示',
    content: `确认${tip}选中用户吗？`,
    onOk() {
      const hideLoading = message.loading({
        content: `正在${tip}`,
        duration: 0,
        key,
      });
      const ids = checkedRows.value.map((row) => row.id).join(',');
      freezeBatchUserApi({ ids, status })
        .then(() => {
          message.success({
            content: `${tip}成功`,
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
const handleDelete = (row: UserInfo) => {
  const key = 'delete_user';
  Modal.confirm({
    title: '提示',
    content: '确认删除该用户吗？',
    onOk() {
      const hideLoading = message.loading({
        content: '正在删除',
        duration: 0,
        key,
      });
      deleteUserApi({ id: row.id as string })
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

// 批量删除
const handleDeleteBatch = () => {
  if (checkedRows.value.length === 0) {
    return;
  }
  const key = 'delete_batch_user';
  Modal.confirm({
    title: '提示',
    content: '确认删除选中用户吗？',
    onOk() {
      const hideLoading = message.loading({
        content: '正在删除',
        duration: 0,
        key,
      });
      const ids = checkedRows.value.map((row) => row.id).join(',');
      deleteBatchUserApi({ ids })
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
const getActions = (row: UserInfo): ActionItem[] => {
  return [
    {
      label: '详情',
      onClick: handleView.bind(null, row),
    },
    {
      label: '密码',
      onClick: handleUserPassword.bind(null, row),
    },
    {
      label: '解冻',
      ifShow: row.status === 2,
      onClick: handleFreeze.bind(null, row, 2),
    },
    {
      label: '冻结',
      danger: true,
      ifShow: row.status === 1,
      onClick: handleFreeze.bind(null, row, 1),
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
      label: '解冻',
      onClick: handleFreezeBatch.bind(null, 2),
    },
    {
      label: '冻结',
      danger: true,
      onClick: handleFreezeBatch.bind(null, 1),
    },
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
          <a-button type="primary" @click="handleAdd">新增用户</a-button>
          <a-button type="primary" @click="handleOpenRecycleBinModal">
            回收站
          </a-button>
          <a-button type="primary" v-access="['system:user:export']">
            导出
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
    <!-- 用户 -->
    <UserDrawerCom @success="handleRefresh" />
    <!-- 修改密码 -->
    <UserPasswordModalCom @success="handleRefresh" />
    <!-- 回收站 -->
    <UserRecycleBinModalCom @success="handleRefresh" />
  </Page>
</template>

<style scoped lang="sass"></style>
