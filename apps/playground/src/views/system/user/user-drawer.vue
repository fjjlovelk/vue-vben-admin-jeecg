<script setup lang="ts">
import { computed, ref, toRaw } from 'vue';

import { useAntdForm, useVbenDrawer } from '@vben/common-ui';
import { getViewType, ViewTypeEnum } from '@vben/constants';

import { message } from 'ant-design-vue';
import cloneDeep from 'lodash.clonedeep';

import {
  addUserApi,
  editUserApi,
  getUserDepartListApi,
  getUserRoleApi,
} from '#/api';

import { userDrawerFormSchema } from './user.data';

defineOptions({
  name: 'UserDrawer',
});
const emit = defineEmits(['success']);

const formId = ref<string>('');
const viewType = ref<ViewTypeEnum>(ViewTypeEnum.ADD);

const drawerTitle = computed(() => `${getViewType(viewType.value)}用户`);

const [Form, formApi] = useAntdForm({
  commonConfig: {
    labelWidth: 100,
  },
  showDefaultActions: false,
  schema: userDrawerFormSchema,
});
const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: handleSubmit,
  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }
    initData();
  },
});

// 初始化数据
async function initData() {
  const values = drawerApi.getData();
  viewType.value = values.viewType;
  if (viewType.value === ViewTypeEnum.ADD) {
    return;
  }
  const newValues = cloneDeep(toRaw(values));
  try {
    drawerApi.lock();
    formId.value = newValues.id;
    newValues.selectedroles =
      (await getUserRoleApi({ userid: values.id })) || [];
    newValues.relTenantIds = ((values.relTenantIds || '') as string)
      .split(',')
      .map((element) => Number.parseInt(element));
    newValues.sex = `${values.sex || ''}`;
    const userDepart = await getUserDepartListApi({ userId: formId.value });
    if (userDepart && userDepart.length > 0) {
      newValues.selecteddeparts = userDepart.map((item) => item.key);
    }
    await formApi.setValues(newValues);
    if (viewType.value === ViewTypeEnum.VIEW) {
      formApi.setState({
        commonConfig: {
          disabled: true,
        },
      });
    } else {
      formApi.updateSchema([{ fieldName: 'username', disabled: true }]);
    }
  } finally {
    drawerApi.unlock();
  }
}

// 表单提交
async function handleSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }
  try {
    drawerApi.lock();
    const values = await formApi.getValues();
    values.selectedroles = ((values.selectedroles || []) as string[]).join(',');
    values.relTenantIds = ((values.relTenantIds || []) as string[]).join(',');
    values.selecteddeparts = ((values.selecteddeparts || []) as string[]).join(
      ',',
    );
    if (viewType.value === ViewTypeEnum.EDIT) {
      values.id = formId.value;
      await editUserApi(values);
    } else {
      await addUserApi(values);
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
