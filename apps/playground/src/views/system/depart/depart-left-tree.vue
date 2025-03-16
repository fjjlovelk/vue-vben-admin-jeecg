<script setup lang="ts">
import type { EventDataNode } from 'ant-design-vue/es/vc-tree/interface';

import type { SystemDepartApi } from '#/api';

import { onMounted, ref } from 'vue';

import { getDepartTreeSyncApi } from '#/api';

const emit = defineEmits(['rootTreeData', 'select']);

const isLoading = ref(false);
// 树data
const treeData = ref<SystemDepartApi.GetDepartTreeSyncResult[]>([]);

// 加载顶级部门信息
async function loadRootTreeData() {
  try {
    isLoading.value = true;
    treeData.value = [];
    const result = await getDepartTreeSyncApi();
    if (Array.isArray(result)) {
      treeData.value = result;
    }
    emit('rootTreeData', treeData.value);
  } finally {
    isLoading.value = false;
  }
}

// 加载子级部门信息
async function loadChildrenTreeData(treeNode: EventDataNode) {
  try {
    const result = await getDepartTreeSyncApi({
      pid: treeNode?.dataRef?.id,
    });
    if (result.length === 0) {
      treeNode!.dataRef!.isLeaf = true;
    } else {
      treeNode!.dataRef!.children = result;
    }
    treeData.value = [...treeData.value];
    emit('rootTreeData', treeData.value);
  } catch (error) {
    console.error(error);
  }
}

// 添加下级
function handleAddSub() {}

// 删除
function handleDelete() {}

// 选中树节点
function handleSelectTree() {}

onMounted(() => {
  loadRootTreeData();
});
</script>

<template>
  <a-spin :spinning="isLoading">
    <template v-if="treeData.length > 0">
      <a-tree
        :load-data="loadChildrenTreeData"
        :tree-data="treeData"
        checkable
        check-strictly
        @select="handleSelectTree"
      >
        <template #title="{ title }">
          <a-dropdown :trigger="['contextmenu']">
            <span>{{ title }}</span>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="handleAddSub">添加下级</a-menu-item>
                <a-menu-item @click="handleDelete" class="!text-red-500">
                  删除
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tree>
    </template>
    <a-empty v-else description="暂无数据" />
  </a-spin>
</template>

<style scoped></style>
