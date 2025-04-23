<script setup lang="ts">
import type { UserInfo } from '@vben/types';

import type { SystemUserApi } from '#/api';

import { useAntdForm, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { changeUserPasswordApi } from '#/api';

import { userPasswordModalFormSchema } from './user.data';

defineOptions({
  name: 'UserPasswordModal',
});

const emit = defineEmits(['success']);

const [Form, formApi] = useAntdForm({
  commonConfig: {
    labelWidth: 100,
  },
  showDefaultActions: false,
  schema: userPasswordModalFormSchema,
});

const [ModalCom, modalApi] = useVbenModal({
  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }
    const { username } = modalApi.getData<UserInfo>();
    formApi.setFieldValue('username', username);
  },
  onConfirm: handleSubmit,
});

// 表单提交
async function handleSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }
  try {
    modalApi.lock();
    const values =
      await formApi.getValues<SystemUserApi.ChangeUserPasswordParams>();
    await changeUserPasswordApi(values);
    message.success('保存成功');
    emit('success');
    modalApi.close();
  } finally {
    modalApi.unlock();
  }
}
</script>

<template>
  <ModalCom title="修改密码" class="w-[700px]">
    <Form />
  </ModalCom>
</template>

<style scoped></style>
