<script setup lang="ts">
import type { Category } from './category.types';

import { computed, ref } from 'vue';

import { useAntdForm, useVbenDrawer } from '@vben/common-ui';
import { getViewType, ViewTypeEnum } from '@vben/constants';

import { message } from 'ant-design-vue';

import { addCategoryApi, editCategoryApi } from '#/api/system/category';

import { categoryDrawerFormSchema } from './category.data';

defineOptions({
  name: 'CategoryDrawer',
});
const emit = defineEmits<{
  success: [];
}>();

const viewType = ref<ViewTypeEnum>(ViewTypeEnum.ADD);

const drawerTitle = computed(() => `${getViewType(viewType.value)}分类字典`);

const [Form, formApi] = useAntdForm({
  commonConfig: {
    labelWidth: 100,
  },
  showDefaultActions: false,
  schema: categoryDrawerFormSchema,
});
const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: handleSubmit,
  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }
    const values = drawerApi.getData();
    viewType.value = values.viewType;
    formApi.setValues(values);
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
    const values = await formApi.getValues<Partial<Category>>();
    await (viewType.value === ViewTypeEnum.EDIT
      ? editCategoryApi(values)
      : addCategoryApi(values));
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
