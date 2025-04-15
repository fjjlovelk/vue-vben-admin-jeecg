<script setup lang="ts">
import type { ActionItem, VxeGridProps } from '@vben/common-ui';
import type { UserInfo } from '@vben/types';

import type { SystemRoleApi } from '#/api';

import { ref } from 'vue';

import {
  MoreAction,
  Page,
  TableCheckTip,
  useTableCheckTip,
  useVbenDrawer,
  useVbenModal,
  useVbenVxeGrid,
} from '@vben/common-ui';

import { message, Modal } from 'ant-design-vue';

import {
  addUserRoleApi,
  deleteUserRoleApi,
  deleteUserRoleBatchApi,
  getUserRoleListApi,
} from '#/api';
import {
  roleUserColumns,
  roleUserQueryFormSchema,
} from '#/views/system/role/role.data';
import UserSelectModal from '#/views/system/user/user-select-modal.vue';

defineOptions({
  name: 'RoleUserDrawer',
});

const formId = ref('');

const { checkedRows, registerGridApi, handleClearCheck, onCheckboxChange } =
  useTableCheckTip<UserInfo>();

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    commonConfig: {
      labelWidth: 70,
    },
    schema: roleUserQueryFormSchema,
    wrapperClass: 'grid-cols-2',
  },
  gridOptions: {
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) =>
          await getUserRoleListApi({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            roleId: formId.value,
            ...formValues,
          }),
      },
    },
    columns: roleUserColumns,
  } as VxeGridProps<SystemRoleApi.GetRoleListResult>,
  gridEvents: {
    checkboxChange: onCheckboxChange,
    checkboxAll: onCheckboxChange,
  },
});
registerGridApi(gridApi);

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }
    const values = drawerApi.getData();
    formId.value = values.id;
  },
});

// 已有用户
const [UserSelectModalCom, userSelectModalApi] = useVbenModal({
  connectedComponent: UserSelectModal,
  destroyOnClose: true,
});

// 刷新表格
const handleRefresh = () => {
  gridApi.query();
};

// 已有用户
const handleAdd = () => {
  userSelectModalApi.open();
};

// 取消关联
const handleDelete = (row: UserInfo) => {
  const key = 'delete_user_role';
  Modal.confirm({
    title: '提示',
    content: '确认取消关联吗？',
    onOk() {
      const hideLoading = message.loading({
        content: '正在取消关联',
        duration: 0,
        key,
      });
      deleteUserRoleApi({ userId: row.id, roleId: formId.value })
        .then(() => {
          message.success({
            content: '取消关联成功',
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

// 批量取消关联
const handleDeleteBatch = () => {
  if (checkedRows.value.length === 0) {
    return;
  }
  const key = 'delete_user_role_batch';
  Modal.confirm({
    title: '提示',
    content: '确认取消关联吗？',
    onOk() {
      const hideLoading = message.loading({
        content: '正在取消关联',
        duration: 0,
        key,
      });
      const ids = checkedRows.value.map((row) => row.id).join(',');
      deleteUserRoleBatchApi({ userIds: ids, roleId: formId.value })
        .then(() => {
          message.success({
            content: '取消关联成功',
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

// 确认选择
const handleConfirmSelect = async (rows: UserInfo[]) => {
  try {
    drawerApi.lock();
    await addUserRoleApi({
      roleId: formId.value,
      userIdList: rows.map((item) => item.id),
    });
    handleRefresh();
  } finally {
    drawerApi.unlock();
  }
};

// 批量按鈕
const getBatchActions = (): ActionItem[] => {
  return [
    {
      label: '取消关联',
      danger: true,
      onClick: handleDeleteBatch.bind(null),
    },
  ];
};
</script>

<template>
  <Drawer title="角色用户" class="w-[800px]" :footer="false">
    <Page auto-content-height>
      <Grid>
        <template #toolbar-actions>
          <div class="mb-[5px] w-full">
            <a-button type="primary" @click="handleAdd">已有用户</a-button>
            <MoreAction
              v-if="checkedRows.length > 0"
              type="default"
              size="normal"
              content="批量操作"
              :actions="getBatchActions()"
            />
          </div>
          <TableCheckTip
            :count="checkedRows.length"
            @clear="handleClearCheck"
          />
        </template>
        <template #action="{ row }">
          <a-button type="link" danger @click="handleDelete(row)" size="small">
            取消关联
          </a-button>
        </template>
      </Grid>
    </Page>
    <!--已有用户-->
    <UserSelectModalCom @ok="handleConfirmSelect" />
  </Drawer>
</template>

<style scoped></style>
