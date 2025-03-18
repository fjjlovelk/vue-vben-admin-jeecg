<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue';

import type { SystemDepartApi } from '#/api';

import { computed, onMounted, ref, watch } from 'vue';

import {
  getDepartPermissionApi,
  getRoleTreeListApi,
  saveDepartPermissionApi,
} from '#/api';

interface Props {
  isLoading: boolean;
  data: null | SystemDepartApi.GetDepartTreeSyncResult;
}

const props = withDefaults(defineProps<Props>(), {
  data: null,
});
const emit = defineEmits(['loading']);

const treeData = ref<any[]>([]);
const allTreeKeys = ref<string[]>([]);
// 勾选的权限
const checkedKeys = ref<(number | string)[]>([]);
// 原始权限
const lastCheckedKeys = ref<string[]>([]);

// 当前选中的部门ID，可能会为空，代表未选择部门
const departId = computed(() => props.data?.id);

// 获取权限列表
const loadData = async () => {
  try {
    emit('loading', true);
    const { treeList, ids } = await getRoleTreeListApi();
    treeData.value = treeList;
    allTreeKeys.value = ids;
  } finally {
    emit('loading', false);
  }
};

// 加载部门权限
const loadDepartPermission = async () => {
  if (!departId.value) {
    return;
  }
  try {
    emit('loading', true);
    const keys = await getDepartPermissionApi({ departId: departId.value });
    checkedKeys.value = keys;
    lastCheckedKeys.value = [...keys];
  } finally {
    emit('loading', false);
  }
};

// 勾选节点
const handleCheck: TreeProps['onCheck'] = (o) => {
  checkedKeys.value = Array.isArray(o) ? o : o.checked;
};

// 保存
const handleSave = async () => {
  if (!departId.value) {
    return;
  }
  try {
    emit('loading', true);
    await saveDepartPermissionApi({
      departId: departId.value!,
      permissionIds: checkedKeys.value.join(','),
      lastpermissionIds: lastCheckedKeys.value.join(','),
    });
    await loadData();
    await loadDepartPermission();
  } finally {
    emit('loading', false);
  }
};

watch(
  () => departId.value,
  () => loadDepartPermission(),
  { immediate: true },
);

onMounted(() => {
  loadData();
});
</script>

<template>
  <template v-if="treeData.length > 0">
    <a-tree
      checkable
      :tree-data="treeData"
      :checked-keys="checkedKeys"
      check-strictly
      style="height: 500px; overflow: auto"
      :field-names="{ children: 'children', title: 'slotTitle', key: 'key' }"
      @check="handleCheck"
    />
  </template>
  <a-empty v-else description="无可配置部门权限" />
  <a-divider />
  <div class="text-right">
    <a-button type="primary" @click="handleSave">保存</a-button>
  </div>
</template>

<style scoped></style>
