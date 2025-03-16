<script setup lang="ts">
import type { ActionItem } from './types';

import { computed } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { isBoolean, isFunction } from '@vben-core/shared/utils';

import { Button, Dropdown, Menu, MenuDivider, MenuItem } from 'ant-design-vue';

interface Props {
  actions: ActionItem[];
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [],
});

const actionItems = computed(() =>
  props.actions
    .filter((item) => isIfShow(item))
    .map((item) => {
      item.divider = item.divider !== false;
      return item;
    }),
);

// 是否显示
function isIfShow(action: ActionItem): boolean {
  const ifShow = action.ifShow;
  let isIfShow = true;
  if (isBoolean(ifShow)) {
    isIfShow = ifShow;
  } else if (isFunction(ifShow)) {
    isIfShow = ifShow(action);
  }
  return isIfShow;
}

// 菜单点击
function handleItemClick(item: ActionItem) {
  if (item.disabled) {
    return;
  }
  item.onClick?.();
}
</script>

<template>
  <Dropdown arrow>
    <Button type="link" @click.prevent>
      更多
      <IconifyIcon icon="ant-design:down-outlined" />
    </Button>
    <template #overlay>
      <Menu>
        <template v-for="(item, index) in actionItems" :key="item">
          <MenuItem
            @click="handleItemClick(item)"
            :disabled="item.disabled"
            :class="[{ '!text-red-500': item.danger }, item.class ?? []]"
          >
            {{ item.label }}
          </MenuItem>
          <MenuDivider
            v-if="item.divider && index !== actionItems.length - 1"
          />
        </template>
      </Menu>
    </template>
  </Dropdown>
</template>

<style scoped></style>
