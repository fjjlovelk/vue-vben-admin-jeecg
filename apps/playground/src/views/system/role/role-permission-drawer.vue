<script setup lang="ts">
import type { SystemMenuApi } from '#/api';
import type { RoleTreeItem } from '#/views/system/role/role.types';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import {
  getRolePermissionApi,
  getRoleTreeListApi,
  saveRolePermissionApi,
} from '#/api';

defineOptions({
  name: 'RolePermissionDrawer',
});
const emit = defineEmits<{
  success: [];
}>();

const roleId = ref<string>('');
const originKeys = ref<string[]>([]);
const checkedKeys = ref<{
  checked: string[];
  halfChecked: string[];
}>({
  checked: [],
  halfChecked: [],
});

const treeData = ref<RoleTreeItem[]>([]);

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: handleSubmit,
  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }
    const values = drawerApi.getData<SystemMenuApi.GetPermissionListResult>();
    if (values) {
      roleId.value = values.id as string;
      initData();
    }
  },
});

// 初始化数据
async function initData() {
  try {
    drawerApi.lock();
    const { treeList } = await getRoleTreeListApi();
    treeData.value = treeList || [];
    const keys = await getRolePermissionApi({
      roleId: roleId.value,
    });
    originKeys.value = [...keys];
    checkedKeys.value.checked = [...keys];
  } finally {
    drawerApi.unlock();
  }
}

// 表单提交
async function handleSubmit() {
  try {
    drawerApi.lock();
    await saveRolePermissionApi({
      lastpermissionIds: originKeys.value.join(','),
      permissionIds: checkedKeys.value.checked.join(','),
      roleId: roleId.value,
    });
    message.success('保存成功');
    emit('success');
    drawerApi.close();
  } finally {
    drawerApi.unlock();
  }
}
</script>

<template>
  <Drawer title="角色权限配置" class="w-[600px]">
    <a-tree
      v-if="treeData.length > 0"
      v-model:checked-keys="checkedKeys"
      checkable
      default-expand-all
      :tree-data="treeData"
      check-strictly
      :field-names="{ children: 'children', title: 'slotTitle', key: 'key' }"
    />
  </Drawer>
</template>

<style scoped></style>
