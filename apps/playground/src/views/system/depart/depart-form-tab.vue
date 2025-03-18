<script setup lang="ts">
import type { SystemDepartApi } from '#/api';
import type { BasicDepartInfo } from '#/views/system/depart/depart.types';

import { computed, onMounted, ref, watch } from 'vue';

import { useAntdForm } from '@vben/common-ui';

import { editDepartApi } from '#/api';

import { departFormSchema, orgCategoryOptions } from './depart.data';

interface Props {
  isLoading: boolean;
  data: null | SystemDepartApi.GetDepartTreeSyncResult;
  rootTreeData: SystemDepartApi.GetDepartTreeSyncResult[];
}

const props = withDefaults(defineProps<Props>(), {
  data: null,
  rootTreeData: () => [],
});
const emit = defineEmits(['success', 'loading']);

const model = ref<Partial<SystemDepartApi.GetDepartTreeSyncResult>>({});
const [Form, formApi] = useAntdForm({
  submitButtonOptions: {
    content: '保存',
  },
  commonConfig: {
    labelWidth: 80,
  },
  schema: departFormSchema,
  handleReset: async () => {
    await formApi.resetForm();
    await formApi.setValues({ ...model.value });
  },
  handleSubmit: async () => {
    try {
      emit('loading', true);
      let values = await formApi.getValues<BasicDepartInfo>();
      values = Object.assign({}, model.value, values);
      // 提交表单
      await editDepartApi(values);
      // 刷新列表
      emit('success');
      Object.assign(model.value, values);
    } finally {
      emit('loading', false);
    }
  },
});

// 机构类型选项
const categoryOptions = computed(() => {
  return props?.data?.parentId
    ? orgCategoryOptions.child
    : orgCategoryOptions.root;
});

onMounted(() => {
  formApi.updateSchema([
    { fieldName: 'parentId', componentProps: { disabled: true } },
    { fieldName: 'orgCode', componentProps: { disabled: true } },
  ]);
  // data 变化，重填表单
  watch(
    () => props.data,
    async (value) => {
      model.value = { ...value };
      await formApi.resetForm();
      await formApi.setValues(model.value);
    },
    { deep: true, immediate: true },
  );
  // 更新 父部门 选项
  watch(
    () => props.rootTreeData,
    () => {
      formApi.updateSchema([
        {
          fieldName: 'parentId',
          componentProps: { treeData: props.rootTreeData },
        },
      ]);
    },
    { deep: true, immediate: true },
  );
  // 监听并更改 orgCategory options
  watch(
    categoryOptions,
    async () => {
      formApi.updateSchema([
        {
          fieldName: 'orgCategory',
          componentProps: { options: categoryOptions.value },
        },
      ]);
    },
    { immediate: true },
  );
});
</script>

<template>
  <Form />
</template>

<style scoped></style>
