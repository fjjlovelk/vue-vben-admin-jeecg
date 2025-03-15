<script setup lang="ts">
import { IconifyIcon } from '@vben/icons';

import { VbenIconButton } from '@vben-core/shadcn-ui';

defineOptions({
  name: 'ThirdPartyLogin',
});
</script>

<template>
  <div class="w-full sm:mx-auto md:max-w-md">
    <div class="mt-4 flex items-center justify-between">
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
      <span class="text-muted-foreground text-center text-xs uppercase">
        其他登录方式
      </span>
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
    </div>

    <div class="mt-4 flex flex-wrap justify-center">
      <VbenIconButton class="mb-3">
        <IconifyIcon icon="ant-design:wechat-outlined" />
      </VbenIconButton>
      <VbenIconButton class="mb-3">
        <IconifyIcon icon="ant-design:qq-outlined" />
      </VbenIconButton>
      <VbenIconButton class="mb-3">
        <IconifyIcon icon="ant-design:github-outlined" />
      </VbenIconButton>
      <VbenIconButton class="mb-3">
        <IconifyIcon icon="ant-design:google-outlined" />
      </VbenIconButton>
    </div>
  </div>
</template>
