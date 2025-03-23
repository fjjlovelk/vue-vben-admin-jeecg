<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { BasicUploadModalProps, BasicUploadProps } from './types';

import { computed, ref, unref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { useVbenModal } from '@vben-core/popup-ui';

import { Tooltip } from 'ant-design-vue';

import BasicUploadModal from './basic-upload-modal.vue';
import BasicUploadPreviewModal from './basic-upload-preivew-modal.vue';

defineOptions({
  name: 'BasicUpload',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<BasicUploadProps>(), {
  modelValue: () => [],
  showPreviewNumber: true,
  emptyHidePreview: false,
});
const emit = defineEmits([
  'change',
  'delete',
  'preview-delete',
  'update:modelValue',
]);

const fileList = ref<string[]>([]);

const basicUploadModalProps = computed<BasicUploadModalProps>(() => ({
  helpText: props.helpText,
  maxSize: props.maxSize,
  maxCount: props.maxCount,
  accept: props.accept,
  multiple: props.multiple,
  uploadParams: props.uploadParams,
  api: props.api,
  name: props.name,
}));

// 是否显示预览按钮
const showPreview = computed(() => {
  if (!props.emptyHidePreview) return true;
  return props.emptyHidePreview ? fileList.value.length > 0 : true;
});

const [BasicUploadModalCom, basicUploadModalApi] = useVbenModal({
  connectedComponent: BasicUploadModal,
});
const [BasicUploadPreviewModalCom, basicUploadPreviewModalApi] = useVbenModal({
  connectedComponent: BasicUploadPreviewModal,
});

// 打开上传modal
const openUploadModal = () => {
  basicUploadModalApi.open();
};

// 打开预览modal
const openPreviewModal = () => {
  basicUploadPreviewModalApi.open();
};

// 上传modal保存操作
const handleChange = (urls: string[]) => {
  fileList.value = [...unref(fileList), ...(urls || [])];
  emit('update:modelValue', fileList.value);
  emit('change', fileList.value);
};

// 预览modal保存操作
const handlePreviewChange = (urls: string[]) => {
  fileList.value = [...(urls || [])];
  emit('update:modelValue', fileList.value);
  emit('change', fileList.value);
};

// 上传modal删除
const handleDelete = (record: Recordable<any>) => {
  emit('delete', record);
};

// 预览modal删除
const handlePreviewDelete = (url: string) => {
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('preview-delete', url);
};

watch(
  () => props.modelValue,
  (value = []) => {
    fileList.value = Array.isArray(value) ? value : [];
  },
  { immediate: true },
);
</script>

<template>
  <a-button-group>
    <a-button type="primary" class="flex items-center" @click="openUploadModal">
      <IconifyIcon icon="carbon:cloud-upload" />
      上传
    </a-button>
    <Tooltip v-if="showPreview">
      <template #title>
        已上传
        <template v-if="fileList.length > 0">{{ fileList.length }}</template>
      </template>
      <a-button class="flex items-center" @click="openPreviewModal">
        <IconifyIcon icon="ant-design:eye-outlined" width="18" height="18" />
        <template v-if="fileList.length > 0 && showPreviewNumber">
          {{ fileList.length }}
        </template>
      </a-button>
    </Tooltip>
  </a-button-group>
  <!-- 上传 -->
  <BasicUploadModalCom
    v-bind="basicUploadModalProps"
    :preview-file-list="fileList"
    @change="handleChange"
    @delete="handleDelete"
  />
  <!-- 预览 -->
  <BasicUploadPreviewModalCom
    :value="fileList"
    @list-change="handlePreviewChange"
    @delete="handlePreviewDelete"
  />
</template>

<style scoped></style>
