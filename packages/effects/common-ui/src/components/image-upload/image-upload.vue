<script setup lang="ts">
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';

import type { ImageUploadProps } from './types';

import { computed, nextTick, ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { getFileNameByUrl } from '@vben/utils';

import { Button, message, Modal, Upload } from 'ant-design-vue';
import { nanoid } from 'nanoid';

defineOptions({
  name: 'ImageUpload',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ImageUploadProps>(), {
  listType: 'picture-card',
  maxCount: 1,
  text: '上传',
});
const emit = defineEmits(['options-change', 'change', 'update:modelValue']);

// 文件列表
const uploadFileList = ref<UploadProps['fileList']>([]);
const isInit = ref(true);
// 预览图
const previewImage = ref<string | undefined>('');
// 预览框状态
const previewVisible = ref<boolean>(false);

const multiple = computed(() => {
  return props.maxCount !== 1;
});

const uploadVisible = computed(() => {
  if (props.maxCount === 0) {
    return true;
  }
  return (uploadFileList.value?.length ?? 0) < props.maxCount;
});

// 格式化文件数据
const initFileList = () => {
  if (!props.modelValue || props.modelValue.length === 0) {
    uploadFileList.value = [];
    return;
  }
  const urls =
    typeof props.modelValue === 'string'
      ? props.modelValue.split(',')
      : props.modelValue;
  const files: UploadProps['fileList'] = [];
  urls.forEach((url) => {
    files.push({
      uid: nanoid(),
      name: getFileNameByUrl(url),
      status: 'done',
      url,
      response: {
        status: 'history',
        message: url,
      },
    });
  });
  uploadFileList.value = files;
};

// 上传前校验
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  if (!file.type.includes('image')) {
    message.info('请选择图片上传');
    return false;
  }
};

const handleChange = ({ file, fileList }: UploadChangeParam) => {
  isInit.value = false;
  if (file.status === 'error') {
    message.error(`${file.name} 上传失败`);
  }
  if (file.status === 'done' && file.response.success === false) {
    const failIndex = uploadFileList.value?.findIndex(
      (item) => item.uid === file.uid,
    );
    if (failIndex !== undefined && failIndex !== -1) {
      uploadFileList.value?.splice(failIndex, 1);
    }
    message.warning(file.response.message);
    return;
  }
  if (file.status === 'uploading') {
    return;
  }
  const fileUrls: string[] = [];
  let noUploadingFileCount = 0;
  fileList.forEach((item) => {
    if (item.status === 'done' && item.response) {
      const url = props.getResponse?.(item.response) || item.response.message;
      fileUrls.push(url);
    }
    if (file.status !== 'uploading') {
      noUploadingFileCount++;
    }
  });
  if (noUploadingFileCount === fileList.length) {
    emit('update:modelValue', fileUrls.join(','));
    nextTick(() => {
      isInit.value = true;
    });
  }
};

// 预览图片
const handlePreview: UploadProps['onPreview'] = (file) => {
  previewImage.value = file.url || file.thumbUrl;
  previewVisible.value = true;
};

watch(
  () => props.modelValue,
  () => {
    if (isInit.value) {
      initFileList();
    }
  },
  {
    immediate: true,
    deep: true,
  },
);
</script>

<template>
  <Upload
    :action="action"
    accept="image/*"
    :before-upload="beforeUpload"
    :data="data"
    :disabled="disabled"
    v-model:file-list="uploadFileList"
    :headers="headers"
    :list-type="listType"
    :multiple="multiple"
    name="file"
    @change="handleChange"
    @preview="handlePreview"
  >
    <div v-if="uploadVisible" class="flex flex-col items-center justify-center">
      <template v-if="listType === 'picture-card'">
        <IconifyIcon icon="ant-design:upload-outlined" />
        <div class="mt-2">{{ text }}</div>
      </template>
      <Button v-else-if="listType === 'picture'" :disabled="disabled">
        <IconifyIcon icon="ant-design:upload-outlined" />
        {{ text }}
      </Button>
    </div>
  </Upload>
  <Modal :open="previewVisible" :footer="null" @cancel="previewVisible = false">
    <img alt="" class="w-full" :src="previewImage" />
  </Modal>
</template>

<style scoped></style>
