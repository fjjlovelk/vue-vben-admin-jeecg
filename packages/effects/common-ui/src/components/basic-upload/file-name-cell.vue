<script setup lang="ts">
import { computed } from 'vue';

import { Progress } from 'ant-design-vue';

import { BasicUploadResultStatus } from './types';

interface Props {
  name: string;
  percent?: number;
  uploadStatus?: BasicUploadResultStatus;
}

const props = withDefaults(defineProps<Props>(), {
  percent: 0,
  uploadStatus: undefined,
});

const status = computed(() => {
  switch (props.uploadStatus) {
    case BasicUploadResultStatus.ERROR: {
      return 'exception';
    }
    case BasicUploadResultStatus.SUCCESS: {
      return 'success';
    }
    case BasicUploadResultStatus.UPLOADING: {
      return 'active';
    }
    default: {
      return 'normal';
    }
  }
});
</script>

<template>
  <div>
    <p class="mb-1 truncate" :title="name">{{ name }}</p>
    <Progress :percent="percent" size="small" :status="status" />
  </div>
</template>

<style scoped></style>
