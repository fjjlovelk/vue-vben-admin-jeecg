<script setup lang="ts">
import type { DataNode, Key } from 'ant-design-vue/es/vc-tree/interface';

import type { AsyncTreeSelectModalProps, AsyncTreeSelectProps } from './types';

import { computed, ref, toRaw, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { useVbenModal } from '@vben-core/popup-ui';

import { Button, Input, Select } from 'ant-design-vue';

import DeptSelectModal from './async-tree-select-modal.vue';

defineOptions({
  name: 'AsyncTreeSelect',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AsyncTreeSelectProps>(), {
  modelValue: () => [],
  placeholder: '请选择',
  cacheable: true,
  multiple: true,
  checkStrictly: true,
  disabled: false,
  labelField: 'title',
  valueField: 'key',
  childrenField: 'children',
});
const emit = defineEmits(['update:modelValue', 'change', 'select']);

const modalProps = computed<AsyncTreeSelectModalProps>(() => ({
  // 弹框标题
  modalTitle: props.modalTitle,
  // 是否多选
  multiple: props.multiple,
  // 最大高度
  maxHeight: props.maxHeight,
  // 是否父子关联
  checkStrictly: props.checkStrictly,
  // 异步获取数据方法
  fetchTreeApi: props.fetchTreeApi,
  // 接口参数
  params: props.params,
  labelField: props.labelField,
  valueField: props.valueField,
  childrenField: props.childrenField,
}));

const fieldNames = computed(() => ({
  label: props.labelField,
  value: props.valueField,
}));

const isLoading = ref(false);
const options = ref<DataNode[]>([]);

const [DeptSelectModalCom, modalApi] = useVbenModal({
  connectedComponent: DeptSelectModal,
  destroyOnClose: !props.cacheable,
});

// 打开弹框
const openModal = () => {
  if (props.disabled || isLoading.value) {
    return;
  }
  modalApi.setData({ keys: toRaw(props.modelValue) || [] }).open();
};

// 直接操作select，选项变化
const handleChange = () => {};

// 选择成功
const handleSuccess = (keys: Key[]) => {
  emit('update:modelValue', keys);
  emit('change', keys);
};

// 获取下拉列表
const getSelectOptions = async () => {
  try {
    isLoading.value = true;
    options.value =
      !props.modelValue || props.modelValue.length === 0
        ? []
        : await props.fetchLabelApi(props.modelValue);
  } finally {
    emit('select', toRaw(options.value));
    isLoading.value = false;
  }
};

watch(
  () => props.modelValue,
  (value) => {
    emit('change', value || []);
    getSelectOptions();
  },
  {
    deep: true,
  },
);

const selectValue = computed({
  get: () => props.modelValue,
  set(val) {
    handleSuccess(val);
  },
});
</script>

<template>
  <div class="flex w-full">
    <!--  eslint-disable vue/attribute-hyphenation  -->
    <Input
      v-show="isLoading"
      class="mr-[4px] flex-1"
      readOnly
      placeholder="加载中…"
      :size="size"
    >
      <template #prefix>
        <IconifyIcon icon="ant-design:loading-outlined" />
      </template>
    </Input>
    <Select
      v-show="!isLoading"
      v-model:value="selectValue"
      class="mr-[4px] flex-1"
      :placeholder="placeholder"
      :open="false"
      :mode="multiple ? 'multiple' : undefined"
      :size="size"
      :disabled="disabled"
      :max-tag-count="maxTagCount"
      :show-search="false"
      :field-names="fieldNames"
      :options="options"
      allow-clear
      @click="openModal"
      @change="handleChange"
    />
    <Button
      type="primary"
      :size="size"
      :disabled="disabled || isLoading"
      @click="openModal"
    >
      选择
    </Button>
    <DeptSelectModalCom v-bind="modalProps" @success="handleSuccess" />
  </div>
</template>

<style scoped></style>
