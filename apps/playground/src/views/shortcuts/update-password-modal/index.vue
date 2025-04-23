<script setup lang="ts">
import type { SystemUserApi } from '#/api';

import { useAntdForm, useVbenModal, z } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { updateUserPasswordApi } from '#/api';

defineOptions({
  name: 'UpdatePasswordModal',
});

const emit = defineEmits(['close']);
const userStore = useUserStore();

const [Form, formApi] = useAntdForm({
  commonConfig: {
    labelWidth: 100,
  },
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      label: '用户账号',
      fieldName: 'username',
      defaultValue: userStore.userInfo?.username,
      dependencies: {
        triggerFields: ['any'],
        if: false,
      },
    },
    {
      component: 'InputPassword',
      label: '旧密码',
      fieldName: 'oldpassword',
      rules: 'required',
    },
    {
      component: 'InputPassword',
      label: '新密码',
      fieldName: 'password',
      rules: z
        .string()
        .min(1, { message: '密码不能为空!' })
        .refine(
          (val) =>
            /^(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/i.test(
              val,
            ),
          {
            message: '密码由8位数字、大小写字母和特殊符号组成!',
          },
        ),
    },
    {
      component: 'InputPassword',
      label: '确认新密码',
      fieldName: 'confirmpassword',
      dependencies: {
        triggerFields: ['password'],
        rules: (values) =>
          z
            .string()
            .nullish()
            .refine((val) => !!val, {
              message: '密码不能为空!',
            })
            .refine((val) => val === values.password, {
              message: '两次输入的密码不一致!',
            }),
      },
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  isOpen: true,
  onCancel() {
    emit('close');
  },
  onConfirm: handleSubmit,
});

// 提交表单
async function handleSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }
  try {
    modalApi.lock();
    const values =
      await formApi.getValues<SystemUserApi.UpdateUserPasswordParams>();
    await updateUserPasswordApi(values);
    message.success('保存成功');
    emit('close');
  } finally {
    modalApi.unlock();
  }
}
</script>

<template>
  <Modal
    title="修改密码"
    :closable="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :fullscreen-button="false"
  >
    <Form />
  </Modal>
</template>

<style scoped></style>
