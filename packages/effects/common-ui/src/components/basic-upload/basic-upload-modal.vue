<script setup lang="ts">
import type { BasicUploadFileItem, BasicUploadModalProps } from './types';

import { computed, ref, toRefs, unref, watch } from 'vue';

import { useVbenVxeGrid } from '@vben/plugins/vxe-table';
import { checkFileType, checkImgType, getBase64WithFile } from '@vben/utils';

import { useVbenModal } from '@vben-core/popup-ui';

import { Image, message, Tag } from 'ant-design-vue';
import { nanoid } from 'nanoid';

import { basicUploadModalColumn } from './data';
import FileNameCell from './file-name-cell.vue';
import { BasicUploadResultStatus } from './types';
import { useUploadTip } from './use-upload-tip';

defineOptions({
  name: 'BasicUploadModal',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<
    BasicUploadModalProps & {
      previewFileList: string[];
    }
  >(),
  {
    maxSize: 2,
    maxCount: Infinity,
    accept: () => [],
    multiple: true,
    name: 'file',
    previewFileList: () => [],
    uploadParams: () => ({}),
  },
);

const emit = defineEmits([
  'change',
  'delete',
  'preview-delete',
  'update:modelValue',
]);

const { accept, helpText, maxCount, maxSize } = toRefs(props);

// 是否正在上传
const isUploadingRef = ref(false);
// 上传文件列表
const fileListRef = ref<BasicUploadFileItem[]>([]);

// 确认按钮
const getConfirmButtonProps = computed(() => {
  const someSuccess = fileListRef.value.some(
    (item) => item.status === BasicUploadResultStatus.SUCCESS,
  );
  return {
    disabled:
      isUploadingRef.value || fileListRef.value.length === 0 || !someSuccess,
  };
});

// 开始上传按钮是否禁用
const getIsSelectFile = computed(() => {
  return (
    fileListRef.value.length > 0 &&
    !fileListRef.value.every(
      (item) => item.status === BasicUploadResultStatus.SUCCESS,
    )
  );
});

// 开始上传按钮文字
const getUploadBtnText = computed(() => {
  if (isUploadingRef.value) {
    return '上传中';
  }
  const someError = fileListRef.value.some(
    (item) => item.status === BasicUploadResultStatus.ERROR,
  );
  return someError ? '重新上传失败文件' : '开始上传';
});

const { getAccept, getStringAccept, getHelpText } = useUploadTip({
  acceptRef: accept,
  helpTextRef: helpText,
  maxCountRef: maxCount,
  maxSizeRef: maxSize,
});

const [Modal, modalApi] = useVbenModal();

const [Grid, gridApi] = useVbenVxeGrid({
  gridClass: 'px-0',
  gridOptions: {
    showOverflow: false,
    pagerConfig: {
      enabled: false,
    },
    height: 500,
    columns: basicUploadModalColumn,
    data: [],
  },
});

// 上传前
const beforeUpload = (file: File) => {
  const { size, name } = file;
  const { maxSize } = props;
  const accept = unref(getAccept);
  // 设置最大值，则判断
  if (maxSize && file.size / 1024 / 1024 >= maxSize) {
    message.error(`只能上传不超过${maxSize}MB的文件!`);
    return false;
  }

  // 设置类型,则判断
  if (accept.length > 0 && !checkFileType(file, accept)) {
    message.error(`只能上传${accept.join(',')}格式文件`);
    return false;
  }
  const commonItem = {
    uuid: nanoid(),
    file,
    size,
    name,
    percent: 0,
    type: name.split('.').pop(),
  };
  // 生成图片缩略图
  if (checkImgType(file)) {
    // beforeUpload，如果异步会调用自带上传方法
    // file.thumbUrl = await getBase64(file);
    getBase64WithFile(file).then(({ result: thumbUrl }) => {
      fileListRef.value = [
        ...unref(fileListRef),
        {
          thumbUrl,
          ...commonItem,
        },
      ];
    });
  } else {
    fileListRef.value = [...unref(fileListRef), commonItem];
  }
  return false;
};

// 删除
const handleRemove = (record: BasicUploadFileItem) => {
  const index = fileListRef.value.findIndex(
    (item) => item.uuid === record.uuid,
  );
  index !== -1 && fileListRef.value.splice(index, 1);
  emit('delete', record);
};

// 上传单个文件
const uploadApiByItem = async (item: BasicUploadFileItem) => {
  const { api } = props;
  if (!api || typeof api !== 'function') {
    return {
      success: false,
      error: 'upload api must exist and be a function',
    };
  }
  try {
    item.status = BasicUploadResultStatus.UPLOADING;
    const res = await api!(
      {
        file: item.file,
        name: props.name,
        ...props.uploadParams,
      },
      (progressEvent: ProgressEvent) => {
        item.percent = Math.trunc(
          (progressEvent.loaded / progressEvent.total) * 100,
        );
      },
    );
    item.status = BasicUploadResultStatus.SUCCESS;
    item.responseData = res;
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    item.status = BasicUploadResultStatus.ERROR;
    return {
      success: false,
      error,
    };
  }
};

// 点击开始上传
const handleStartUpload = async () => {
  const { maxCount } = props;
  if (
    fileListRef.value.length + (props.previewFileList?.length ?? 0) >
    maxCount
  ) {
    message.warning(`最多只能上传${maxCount}个文件`);
    return;
  }
  try {
    isUploadingRef.value = true;
    // 只上传不是成功状态的
    const uploadFileList =
      fileListRef.value.filter(
        (item) => item.status !== BasicUploadResultStatus.SUCCESS,
      ) || [];
    const data = await Promise.all(
      uploadFileList.map((item) => uploadApiByItem(item)),
    );
    isUploadingRef.value = false;
    const errorList = data.filter((item: any) => !item.success);
    if (errorList.length > 0) throw errorList;
  } catch (error) {
    isUploadingRef.value = false;
    throw error;
  }
};

const getFileList = () => {
  const fileList: string[] = [];
  for (const item of fileListRef.value) {
    const { status, responseData } = item;
    if (status === BasicUploadResultStatus.SUCCESS && responseData) {
      fileList.push(responseData.url);
    }
  }
  return fileList;
};

// 点击保存
const handleConfirm = () => {
  if (fileListRef.value.length > props.maxCount) {
    message.warning(`最多只能上传${props.maxCount}个文件`);
    return;
  }
  if (isUploadingRef.value) {
    message.warning('请等待文件上传后，保存!');
    return;
  }
  // 存在一个上传成功的即可保存
  const fileList = getFileList();
  if (fileList.length <= 0) {
    message.warning('没有上传成功的文件，无法保存!');
    return;
  }
  fileListRef.value = [];
  modalApi.close();
  emit('change', fileList);
};

// 点击关闭：则所有操作不保存，包括上传的
const handleCancel = () => {
  if (isUploadingRef.value) {
    message.warning('请等待文件上传后，保存!');
    return;
  }
  fileListRef.value = [];
  modalApi.close();
};

watch(
  () => fileListRef.value,
  (value) => {
    gridApi.setGridOptions({
      data: value || [],
    });
  },
  {
    deep: true,
  },
);
</script>

<template>
  <Modal
    title="上传"
    class="w-[700px]"
    :show-cancel-button="false"
    :show-confirm-button="false"
    :fullscreen-button="false"
    :closable="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <template #prepend-footer>
      <a-button @click="handleCancel" :disabled="isUploadingRef">
        取消
      </a-button>
      <a-button
        @click="handleStartUpload"
        color="success"
        :disabled="!getIsSelectFile"
        :loading="isUploadingRef"
      >
        {{ getUploadBtnText }}
      </a-button>
      <a-button
        @click="handleConfirm"
        type="primary"
        v-bind="getConfirmButtonProps"
      >
        确认
      </a-button>
    </template>
    <div class="flex items-center">
      <a-alert :message="getHelpText" type="info" banner />
      <a-upload
        :accept="getStringAccept"
        :multiple="multiple"
        :before-upload="beforeUpload"
        :show-upload-list="false"
        class="ml-[8px] flex-1 text-right"
      >
        <a-button type="primary">选择文件</a-button>
      </a-upload>
    </div>
    <Grid>
      <template #thumbUrl="{ row }">
        <Image v-if="row.thumbUrl" :src="row.thumbUrl" />
      </template>
      <template #name="{ row }">
        <FileNameCell
          :name="row.name"
          :percent="row.percent"
          :upload-status="row.status"
        />
      </template>
      <template #size="{ row }">
        {{ `${((row.size || 0) / 1024).toFixed(2)}KB` }}
      </template>
      <template #status="{ row }">
        <Tag
          v-if="row.status === BasicUploadResultStatus.SUCCESS"
          color="green"
        >
          上传成功
        </Tag>
        <Tag
          v-else-if="row.status === BasicUploadResultStatus.ERROR"
          color="red"
        >
          上传失败
        </Tag>
        <Tag
          v-else-if="row.status === BasicUploadResultStatus.UPLOADING"
          color="blue"
        >
          上传中
        </Tag>
      </template>
      <template #action="{ row }">
        <a-button type="link" danger @click="handleRemove(row)" size="small">
          删除
        </a-button>
      </template>
    </Grid>
  </Modal>
</template>

<style scoped></style>
