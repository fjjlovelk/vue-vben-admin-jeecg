<script setup lang="ts">
import type { PermissionMenu } from './menu.types';

import { computed, ref } from 'vue';

import { useAntdForm, useVbenDrawer } from '@vben/common-ui';
import { getViewType, ViewTypeEnum } from '@vben/constants';

import { message } from 'ant-design-vue';

import { addPermissionApi, editPermissionApi } from '#/api';

import { menuDrawerFormSchema } from './menu.data';

defineOptions({
  name: 'MenuDrawer',
});
const emit = defineEmits<{
  success: [];
}>();

const formId = ref<string>();
const viewType = ref<ViewTypeEnum>(ViewTypeEnum.ADD);

const drawerTitle = computed(() => `${getViewType(viewType.value)}菜单`);

const [Form, formApi] = useAntdForm({
  commonConfig: {
    labelWidth: 100,
  },
  showDefaultActions: false,
  schema: menuDrawerFormSchema,
});
const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: handleSubmit,
  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }
    const values = drawerApi.getData();
    viewType.value = values.viewType;
    if (viewType.value === ViewTypeEnum.EDIT) {
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
    let values = await formApi.getValues<Partial<PermissionMenu>>();
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
    if (viewType.value === ViewTypeEnum.EDIT) {
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
