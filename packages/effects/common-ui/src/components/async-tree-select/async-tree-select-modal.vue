<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';
import type { DataNode, Key } from 'ant-design-vue/es/vc-tree/interface';

import type { AnyFunction, Recordable } from '@vben/types';

import type { AsyncTreeSelectModalProps } from './types';

import { computed, ref, toRaw } from 'vue';

import { useVbenModal } from '@vben-core/popup-ui';

defineOptions({
  name: 'AsyncTreeSelectModal',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AsyncTreeSelectModalProps>(), {
  modalTitle: '选择',
  maxHeight: 500,
  checkStrictly: true,
  params: () => ({}),
});
const emit = defineEmits(['success']);

// 已选择的key
const checkedKeys = ref<Key[]>([]);
// 已加载的key，用来防止重复加载
const loadedKeys = ref<Key[]>([]);
// 已展开的key，用来保持展开状态
const expandedKeys = ref<Key[]>([]);
// 树数据
const treeData = ref<Recordable<any>[]>([]);
// 是否已经获取过数据
const hasFetchedData = ref(false);

const fieldNames = computed(() => ({
  children: props.childrenField,
  title: props.labelField,
  key: props.valueField,
}));

const [Modal, modalApi] = useVbenModal({
  onOpenChange,
  onConfirm() {
    modalApi.close();
    emit('success', toRaw(checkedKeys.value));
  },
});

// 打开、关闭弹框
function onOpenChange(isOpen: boolean) {
  if (!isOpen) {
    return;
  }
  const { keys } = modalApi.getData<{ keys: Key[] }>();
  checkedKeys.value = [...keys];
  onLoadRootData();
}

// 获取参数
const getParams = async (dataRef?: DataNode) => {
  if (
    !props.params ||
    Object.prototype.toString.call(props.params) === '[object Object]'
  ) {
    return props.params || {};
  }
  return (props.params as AnyFunction<any, Recordable<any>>)(dataRef);
};

// 加载子级数据
const onLoadData: TreeProps['loadData'] = async (treeNode) => {
  try {
    loadedKeys.value.push(treeNode.key);
    const params = await getParams(treeNode.dataRef);
    const result = await props.fetchTreeApi!(params);
    if (result.length === 0) {
      treeNode!.dataRef!.isLeaf = true;
    } else {
      treeNode!.dataRef!.children = result;
    }
    treeData.value = [...treeData.value];
  } catch (error) {
    console.error(error);
  }
};

// 加载根数据
const onLoadRootData = async () => {
  if (!props.fetchTreeApi) {
    console.error('未传入异步获取数据接口！');
    return;
  }
  if (hasFetchedData.value) {
    return;
  }
  try {
    modalApi.lock();
    const params = await getParams();
    treeData.value = await props.fetchTreeApi!(params);
    hasFetchedData.value = true;
  } finally {
    modalApi.unlock();
  }
};

// 勾选节点
const handleCheckTree: TreeProps['onCheck'] = (e, info) => {
  if (props.multiple) {
    checkedKeys.value = Array.isArray(e) ? e : e.checked;
    return;
  }
  checkedKeys.value = info.checked ? [info.node.eventKey as Key] : [];
};
</script>

<template>
  <Modal
    :title="modalTitle"
    :draggable="true"
    class="w-[600px]"
    :content-class="`h-[${maxHeight}px]`"
  >
    <a-tree
      :checked-keys="checkedKeys"
      checkable
      :selectable="false"
      :load-data="onLoadData"
      :tree-data="treeData"
      :check-strictly="checkStrictly"
      :field-names="fieldNames"
      :loaded-keys="loadedKeys"
      v-model:expanded-keys="expandedKeys"
      @check="handleCheckTree"
    />
  </Modal>
</template>
