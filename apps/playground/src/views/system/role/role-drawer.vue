<script setup lang="ts">
import type { PermissionMenuItem } from '#/views/system/menu/menu.types';

import { computed, ref } from 'vue';

import { useAntdForm, useVbenDrawer } from '@vben/common-ui';
import { getViewType, ViewTypeEnum } from '@vben/constants';

import { message } from 'ant-design-vue';

import { addPermissionApi, editPermissionApi } from '#/api';

import { roleDrawerFormSchema } from './role.data';

defineOptions({
  name: 'RoleDrawer',
});
const emit = defineEmits<{
  success: [];
}>();

const formId = ref<string>();
const viewType = ref<ViewTypeEnum>(ViewTypeEnum.ADD);

const drawerTitle = computed(() => `${getViewType(viewType.value)}角色`);

const [Form, formApi] = useAntdForm({
  commonConfig: {
    labelWidth: 100,
  },
  showDefaultActions: false,
  schema: roleDrawerFormSchema,
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
    const values = await formApi.getValues<Partial<PermissionMenuItem>>();
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
