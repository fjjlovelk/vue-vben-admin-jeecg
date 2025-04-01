<script setup lang="ts">
import type { DictItem } from './dict.types';

import { computed, ref } from 'vue';

import { useAntdForm, useVbenDrawer } from '@vben/common-ui';
import { getViewType, ViewTypeEnum } from '@vben/constants';

import { message } from 'ant-design-vue';

import { addDictItemApi, editDictItemApi } from '#/api';

import { dictItemDrawerFormSchema } from './dict.data';

defineOptions({
  name: 'DictItemDrawer',
});
const emit = defineEmits<{
  success: [];
}>();

const dictId = ref<string>('');
const formId = ref<string>();
const viewType = ref<ViewTypeEnum>(ViewTypeEnum.ADD);

const drawerTitle = computed(() => `${getViewType(viewType.value)}字典项`);

const [Form, formApi] = useAntdForm({
  commonConfig: {
    labelWidth: 100,
  },
  showDefaultActions: false,
  schema: dictItemDrawerFormSchema,
});
const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: handleSubmit,
  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }
    const values = drawerApi.getData();
    dictId.value = values.dictId;
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
    const values = await formApi.getValues<Partial<DictItem>>();
    if (viewType.value === ViewTypeEnum.EDIT) {
      values.id = formId.value;
      await editDictItemApi({ ...values, dictId: dictId.value });
    } else {
      await addDictItemApi({ ...values, dictId: dictId.value });
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
