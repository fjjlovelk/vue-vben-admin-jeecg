<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue';

import type { ActionItem } from '@vben/common-ui';

import type { SystemDepartApi } from '#/api';

import { nextTick, onMounted, ref } from 'vue';

import { MoreAction, useVbenDrawer } from '@vben/common-ui';
import { ViewTypeEnum } from '@vben/constants';

import { message, Modal } from 'ant-design-vue';

import {
  deleteBatchDepartApi,
  getDepartTreeSyncApi,
  searchDepartApi,
} from '#/api';

import DepartDrawer from './depart-drawer.vue';

interface Props {
  isLoading: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});
const emit = defineEmits(['rootTreeData', 'select', 'loading']);

// 树组件重新加载
const treeReloading = ref(false);
// 搜索关键字
const searchKeyword = ref('');
// 当前选中的项
const selectedKeys = ref<(number | string)[]>([]);
// 当前展开的项
const expandedKeys = ref<(number | string)[]>([]);
// 当前勾选的项
const checkedKeys = ref<(number | string)[]>([]);
// 当前选中的部门
const currentDepart = ref<null | SystemDepartApi.GetDepartTreeSyncResult>(null);
// 树data
const treeData = ref<SystemDepartApi.GetDepartTreeSyncResult[]>([]);

const [DepartDrawerCom, departDrawerApi] = useVbenDrawer({
  connectedComponent: DepartDrawer,
  destroyOnClose: true,
});

// 加载顶级部门信息
const loadRootTreeData = async () => {
  try {
    emit('loading', true);
    treeData.value = [];
    const result = await getDepartTreeSyncApi();
    if (Array.isArray(result)) {
      treeData.value = result;
    }
    if (expandedKeys.value.length === 0) {
      autoExpandParentNode();
    } else {
      if (selectedKeys.value.length === 0) {
        const item = treeData.value[0];
        if (item) {
          // 默认选中第一个
          setSelectedKey(item.id!, item);
        }
      } else {
        emit('select', currentDepart.value);
      }
    }
    emit('rootTreeData', treeData.value);
  } finally {
    emit('loading', false);
  }
};

// 加载子级部门信息
const loadChildrenTreeData: TreeProps['loadData'] = async (treeNode) => {
  try {
    const result = await getDepartTreeSyncApi({
      pid: treeNode?.dataRef?.id,
    });
    if (result.length === 0) {
      treeNode!.dataRef!.isLeaf = true;
    } else {
      treeNode!.dataRef!.children = result;
      if (expandedKeys.value.length > 0) {
        // 判断获取的子级是否有当前展开的项
        const subKeys: (number | string)[] = [];
        for (const key of expandedKeys.value) {
          if (result.some((item) => item.id === key)) {
            subKeys.push(key);
          }
        }
        if (subKeys.length > 0) {
          expandedKeys.value = [...expandedKeys.value];
        }
      }
    }
    treeData.value = [...treeData.value];
    emit('rootTreeData', treeData.value);
  } catch (error) {
    console.error(error);
  }
};

// 自动展开父节点，只展开一级
const autoExpandParentNode = () => {
  const item = treeData.value[0];
  if (!item) {
    emit('select', null);
    return;
  }
  if (!item.isLeaf) {
    expandedKeys.value = [item.key];
  }
  // 默认选中第一个
  setSelectedKey(item.id!, item);
  reloadTree();
};

// 设置当前选中的行
const setSelectedKey = (
  key: number | string,
  data?: SystemDepartApi.GetDepartTreeSyncResult,
) => {
  selectedKeys.value = [key];
  if (data) {
    currentDepart.value = data;
    emit('select', data);
  }
};

// 重新加载树组件，防止无法默认展开数据
const reloadTree = async () => {
  await nextTick();
  treeReloading.value = true;
  await nextTick();
  treeReloading.value = false;
};

// 查询部门
const handleSearch = async (value: string) => {
  if (props.isLoading) {
    return;
  }
  searchKeyword.value = value;
  if (!value) {
    loadRootTreeData();
    return;
  }
  try {
    emit('loading', true);
    treeData.value = [];
    const result = await searchDepartApi({ keyWord: value });
    if (Array.isArray(result)) {
      treeData.value = result;
    }
    autoExpandParentNode();
  } finally {
    emit('loading', false);
  }
};

// 新增
const handleAdd = () => {
  departDrawerApi.setData({ viewType: ViewTypeEnum.ADD }).open();
};

// 添加下级
const handleAddSub = (parentId = currentDepart.value?.id) => {
  if (!parentId) {
    message.warning('请先选择一个部门');
    return;
  }
  departDrawerApi
    .setData({
      viewType: ViewTypeEnum.ADD_SUB,
      rootTreeData: treeData.value,
      parentId,
    })
    .open();
};

// 删除操作
const handleDeleteFn = (ids: string, isBatch = false) => {
  Modal.confirm({
    title: '提示',
    content: '确认删除部门吗？',
    onOk: async () => {
      try {
        emit('loading', true);
        await deleteBatchDepartApi({ ids });
        await loadRootTreeData();
        if (isBatch) {
          checkedKeys.value = [];
        }
      } finally {
        emit('loading', false);
      }
    },
  });
};

// 删除
const handleDelete = (id?: string) => {
  if (!id) {
    return;
  }
  handleDeleteFn(id);
};

// 删除
const handleDeleteBatch = () => {
  if (checkedKeys.value.length === 0) {
    return;
  }
  handleDeleteFn(checkedKeys.value.join(','), true);
};

// 选中树节点
const handleSelectTree: TreeProps['onSelect'] = (keys, event) => {
  if (keys.length > 0 && selectedKeys.value[0] !== keys[0]) {
    setSelectedKey(
      keys[0]!,
      event.selectedNodes[0] as SystemDepartApi.GetDepartTreeSyncResult,
    );
  } else {
    // 这样可以防止用户取消选择
    setSelectedKey(selectedKeys.value[0] as string);
  }
};

// 勾选树节点
const handleCheckTree: TreeProps['onCheck'] = (e) => {
  checkedKeys.value = Array.isArray(e) ? e : e.checked;
};

// 表格内部更多按钮
function getActions(): ActionItem[] {
  return [
    {
      label: '删除',
      danger: true,
      onClick: handleDeleteBatch.bind(null),
    },
  ];
}

onMounted(() => {
  loadRootTreeData();
});

defineExpose({
  loadRootTreeData,
});
</script>

<template>
  <a-card :bordered="false" class="h-full">
    <div class="mb-[10px]">
      <a-button type="primary" @click="handleAdd">新增</a-button>
      <a-button type="primary" @click="handleAddSub()">添加下级</a-button>
      <MoreAction
        v-if="checkedKeys.length > 0"
        type="default"
        size="normal"
        content="批量操作"
        :actions="getActions()"
      />
    </div>
    <a-alert type="info" show-icon class="mb-[10px]">
      <template #message>
        <template v-if="checkedKeys.length > 0">
          <span>已选中 {{ checkedKeys.length }} 条记录</span>
          <a-divider type="vertical" />
          <a @click="checkedKeys = []">清空</a>
        </template>
        <template v-else>
          <span>未选中任何数据</span>
        </template>
      </template>
    </a-alert>
    <a-input-search
      placeholder="按部门名称搜索…"
      class="mb-[10px]"
      @search="handleSearch"
    />
    <template v-if="treeData.length > 0">
      <a-tree
        v-if="!treeReloading"
        :click-row-to-expand="false"
        :load-data="loadChildrenTreeData"
        :tree-data="treeData"
        checkable
        check-strictly
        :selected-keys="selectedKeys"
        :checked-keys="checkedKeys"
        v-model:expanded-keys="expandedKeys"
        @select="handleSelectTree"
        @check="handleCheckTree"
      >
        <template #title="{ title, dataRef }">
          <a-dropdown :trigger="['contextmenu']">
            <span>{{ title }}</span>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="handleAddSub(dataRef?.id)">
                  添加下级
                </a-menu-item>
                <a-menu-item
                  @click="handleDelete(dataRef?.id)"
                  class="!text-red-500"
                >
                  删除
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tree>
    </template>
    <a-empty v-else description="暂无数据" />
  </a-card>
  <DepartDrawerCom @success="loadRootTreeData" />
</template>

<style scoped></style>
