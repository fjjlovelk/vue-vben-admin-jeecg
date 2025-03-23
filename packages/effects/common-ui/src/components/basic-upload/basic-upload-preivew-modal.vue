<script setup lang="ts">
import type { PropType } from 'vue';

import type { BasicUploadPreviewFileItem } from './types';

import { ref, watch } from 'vue';

import { useVbenVxeGrid } from '@vben/plugins/vxe-table';
import { downloadByUrl, isImgTypeByName } from '@vben/utils';

import { useVbenModal } from '@vben-core/popup-ui';

import { Image } from 'ant-design-vue';

import { basicUploadPreviewModalColumn } from './data';

defineOptions({
  name: 'BasicUploadPreviewModal',
});

const props = defineProps({
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});
const emit = defineEmits(['list-change', 'delete']);

const fileListRef = ref<BasicUploadPreviewFileItem[]>([]);

watch(
  () => props.value,
  (value) => {
    if (!Array.isArray(value)) {
      value = [];
    }
    fileListRef.value = value
      .filter((item) => !!item)
      .map((item) => {
        return {
          url: item,
          type: item.split('.').pop() || '',
          name: item.split('/').pop() || '',
        };
      });
  },
  { immediate: true },
);

const [Modal] = useVbenModal();

const [Grid, gridApi] = useVbenVxeGrid({
  gridClass: 'px-0',
  gridOptions: {
    showOverflow: false,
    pagerConfig: {
      enabled: false,
    },
    height: 500,
    columns: basicUploadPreviewModalColumn,
    data: [],
  },
});

// 删除
const handleRemove = (record: BasicUploadPreviewFileItem) => {
  const index = fileListRef.value.findIndex((item) => item.url === record.url);
  if (index !== -1) {
    const removed = fileListRef.value.splice(index, 1);
    emit('delete', removed?.[0]?.url);
    emit(
      // eslint-disable-next-line vue/custom-event-name-casing
      'list-change',
      fileListRef.value.map((item) => item.url),
    );
  }
};

// 下载
const handleDownload = (record: BasicUploadPreviewFileItem) => {
  const { url = '' } = record;
  downloadByUrl({ url });
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
  <Modal title="预览" :show-confirm-button="false" class="w-[700px]">
    <Grid>
      <template #url="{ row }">
        <Image v-if="row.url && isImgTypeByName(row.url)" :src="row.url" />
      </template>
      <template #action="{ row }">
        <a-button type="link" danger @click="handleRemove(row)" size="small">
          删除
        </a-button>
        <a-button type="link" @click="handleDownload(row)" size="small">
          下载
        </a-button>
      </template>
    </Grid>
  </Modal>
</template>

<style scoped></style>
