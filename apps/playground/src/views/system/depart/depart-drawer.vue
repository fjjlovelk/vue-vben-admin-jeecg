<script setup lang="ts">
import type { PickEnumKeys } from '@vben/types';

import type { BasicDepartInfo } from './depart.types';

import { useAntdForm, useVbenDrawer } from '@vben/common-ui';
import { ViewTypeEnum } from '@vben/constants';

import { message } from 'ant-design-vue';

import { addDepartApi } from '#/api';

import { departFormSchema, orgCategoryOptions } from './depart.data';

defineOptions({
  name: 'DepartDrawer',
});
const emit = defineEmits<{
  success: [];
}>();

const [Form, formApi] = useAntdForm({
  commonConfig: {
    labelWidth: 80,
  },
  showDefaultActions: false,
  schema: departFormSchema,
});
const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: handleSubmit,
  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }
    const values = drawerApi.getData();
    const viewType = values.viewType as PickEnumKeys<
      typeof ViewTypeEnum,
      'ADD' | 'ADD_SUB'
    >;
    const isChild = viewType === ViewTypeEnum.ADD_SUB;
    const categoryOptions = isChild
      ? orgCategoryOptions.child
      : orgCategoryOptions.root;
    formApi.updateSchema([
      {
        fieldName: 'parentId',
        componentProps: {
          // 如果是添加子部门，就禁用该字段
          disabled: isChild,
          treeData: values.rootTreeData || [],
        },
        dependencies: {
          triggerFields: ['departName'],
          show: isChild,
        },
      },
      {
        fieldName: 'orgCode',
        dependencies: {
          triggerFields: ['departName'],
          show: false,
        },
      },
      {
        fieldName: 'orgCategory',
        componentProps: { options: categoryOptions },
      },
    ]);
    formApi.setValues({
      parentId: values.parentId,
      departOrder: 0,
      orgCategory: categoryOptions?.[0]?.value || undefined,
    });
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
    const values = await formApi.getValues<BasicDepartInfo>();
    await addDepartApi(values);
    message.success('保存成功');
    emit('success');
    drawerApi.close();
  } finally {
    drawerApi.unlock();
  }
}
</script>

<template>
  <Drawer title="新增部门" class="w-[600px]">
    <Form />
  </Drawer>
</template>

<style scoped></style>
