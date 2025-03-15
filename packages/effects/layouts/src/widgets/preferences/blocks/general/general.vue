<script setup lang="ts">
import SelectItem from '../select-item.vue';
import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceGeneralConfig',
});

const appDynamicTitle = defineModel<boolean>('appDynamicTitle');
const appWatermark = defineModel<boolean>('appWatermark');
const appEnableCheckUpdates = defineModel<boolean>('appEnableCheckUpdates');
</script>

<template>
  <SwitchItem v-model="appDynamicTitle">
    动态标题
  </SwitchItem>
  <SwitchItem v-model="appWatermark">
    水印
  </SwitchItem>
  <SwitchItem v-model="appEnableCheckUpdates">
    定时检查更新
  </SwitchItem>
</template>
