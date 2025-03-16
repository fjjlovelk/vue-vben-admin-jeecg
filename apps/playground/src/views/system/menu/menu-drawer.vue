<script setup lang="ts">
import type { PermissionMenuItem } from '#/views/system/menu/menu.types';

import { computed, ref } from 'vue';

import { useAntdForm, useVbenDrawer } from '@vben/common-ui';
import { getViewType, ViewType } from '@vben/constants';

import { message } from 'ant-design-vue';

import { addPermissionApi, editPermissionApi } from '#/api';

import { menuDrawerFormConfig } from './menu.data';

defineOptions({
  name: 'MenuDrawer',
});
const emit = defineEmits<{
  success: [];
}>();

const formId = ref<string>();
const viewType = ref<ViewType>(ViewType.Add);

const drawerTitle = computed(() => `${getViewType(viewType.value)}菜单`);

const [Form, formApi] = useAntdForm(menuDrawerFormConfig);
const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: handleSubmit,
  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }
    const values = drawerApi.getData();
    viewType.value = values.viewType;
    if (viewType.value === ViewType.Edit) {
      formApi.setValues(values);
      formId.value = values.id;
    }
  },
});

// 表单提交
async function handleSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }
  try {
    drawerApi.lock();
    let values = await formApi.getValues<Partial<PermissionMenuItem>>();
    switch (values.menuType) {
      case 0: {
        values.parentId = undefined;
        values.perms = undefined;
        values.permsType = undefined;
        values.status = undefined;
        break;
      }
      case 1: {
        values.redirect = undefined;
        values.perms = undefined;
        values.permsType = undefined;
        values.status = undefined;
        break;
      }
      case 2: {
        values = {
          menuType: 2,
          name: values.name,
          parentId: values.parentId,
          perms: values.perms,
          permsType: values.permsType,
          status: values.status,
        };
        break;
      }
    }
    if (viewType.value === ViewType.Edit) {
      values.id = formId.value;
      await editPermissionApi(values);
    } else {
      await addPermissionApi(values);
    }
    message.success('保存成功');
    emit('success');
    drawerApi.close();
  } finally {
    drawerApi.unlock();
  }
}
</script>

<template>
  <Drawer :title="drawerTitle" class="w-[600px]">
    <Form />
  </Drawer>
</template>

<style scoped></style>
