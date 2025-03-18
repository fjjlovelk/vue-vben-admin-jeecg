<script setup lang="ts">
import type { TableCheckTipProps } from './type';

import { Alert } from 'ant-design-vue';

defineOptions({
  name: 'TableCheckTip',
});

withDefaults(defineProps<TableCheckTipProps>(), {
  count: 0,
  isSpanPage: true,
});

const emit = defineEmits(['clear']);
</script>

<template>
  <Alert type="info" show-icon class="w-full">
    <template #message>
      <template v-if="count > 0">
        <span>已选中 {{ count }} 条记录{{ isSpanPage ? '(可跨页)' : '' }}</span>
        <a-divider type="vertical" />
        <a @click="emit('clear')" class="text-blue-400">清空</a>
      </template>
      <template v-else>
        <span>未选中任何数据</span>
      </template>
    </template>
  </Alert>
</template>

<style scoped></style>
