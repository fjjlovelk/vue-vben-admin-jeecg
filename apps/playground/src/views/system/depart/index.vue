<script setup lang="ts">
import { Page } from '@vben/common-ui';

import DepartLeftTree from '#/views/system/depart/depart-left-tree.vue';
</script>

<template>
  <Page auto-content-height content-class="flex justify-between">
    <a-card style="width: calc(50% - 5px)">
      <DepartLeftTree />
    </a-card>
    <a-card style="width: calc(50% - 5px)" />
  </Page>
</template>

<style scoped lang="scss">
:deep(.ant-card-body) {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
