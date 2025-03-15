<script lang="ts" setup>
import type {VbenFormSchema} from '@vben/common-ui';
import {AuthenticationCodeLogin, z} from '@vben/common-ui';
import type {Recordable} from '@vben/types';

import {computed, ref, useTemplateRef} from 'vue';

import {message} from 'ant-design-vue';

defineOptions({ name: 'CodeLogin' });

const loading = ref(false);
const CODE_LENGTH = 6;
const loginRef =
  useTemplateRef<InstanceType<typeof AuthenticationCodeLogin>>('loginRef');
function sendCodeApi(phoneNumber: string) {
  message.loading({
    content: '正在发送验证码',
    duration: 0,
    key: 'sending-code',
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      message.success({
        content: `验证码已发送至${phoneNumber}`,
        duration: 3,
        key: 'sending-code',
      });
      resolve({ code: '123456', phoneNumber });
    }, 3000);
  });
}
const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '手机号码',
      },
      fieldName: 'phoneNumber',
      label: '手机号码',
      rules: z
        .string()
        .min(1, { message: '请输入手机号' })
        .refine((v) => /^\d{11}$/.test(v), {
          message: '手机号码格式错误',
        }),
    },
    {
      component: 'VbenPinInput',
      componentProps: {
        codeLength: CODE_LENGTH,
        createText: (countdown: number) => {
          return countdown > 0
            ? `${countdown}秒后重新获取`
            : '获取验证码';
        },
        handleSendCode: async () => {
          // 模拟发送验证码
          // Simulate sending verification code
          loading.value = true;
          const formApi = loginRef.value?.getFormApi();
          if (!formApi) {
            loading.value = false;
            throw new Error('formApi is not ready');
          }
          await formApi.validateField('phoneNumber');
          const isPhoneReady = await formApi.isFieldValid('phoneNumber');
          if (!isPhoneReady) {
            loading.value = false;
            throw new Error('Phone number is not Ready');
          }
          const { phoneNumber } = await formApi.getValues();
          await sendCodeApi(phoneNumber);
          loading.value = false;
        },
        placeholder: '验证码',
      },
      fieldName: 'code',
      label: '验证码',
      rules: z.string().length(CODE_LENGTH, {
        message: `请输入${CODE_LENGTH}位验证码`,
      }),
    },
  ];
});
/**
 * 异步处理登录操作
 * Asynchronously handle the login process
 * @param values 登录表单数据
 */
async function handleLogin(values: Recordable<any>) {
  // eslint-disable-next-line no-console
  console.log(values);
}
</script>

<template>
  <AuthenticationCodeLogin
    ref="loginRef"
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleLogin"
  />
</template>
