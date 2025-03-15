<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { BasicOption, Recordable } from '@vben/types';

import { computed, markRaw, useTemplateRef } from 'vue';

import { AuthenticationLogin, SliderCaptcha, z } from '@vben/common-ui';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const MOCK_USER_OPTIONS: BasicOption[] = [
  {
    label: 'Super',
    value: 'vben',
  },
  {
    label: 'Admin',
    value: 'admin',
  },
  {
    label: 'User',
    value: 'jack',
  },
];

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenSelect',
      // componentProps(_values, form) {
      //   return {
      //     'onUpdate:modelValue': (value: string) => {
      //       const findItem = MOCK_USER_OPTIONS.find(
      //         (item) => item.value === value,
      //       );
      //       if (findItem) {
      //         form.setValues({
      //           password: '123456',
      //           username: findItem.label,
      //         });
      //       }
      //     },
      //     options: MOCK_USER_OPTIONS,
      //     placeholder: '快速选择账号',
      //   };
      // },
      componentProps: {
        options: MOCK_USER_OPTIONS,
        placeholder: '快速选择账号',
      },
      fieldName: 'selectAccount',
      label: '快速选择账号',
      rules: z
        .string()
        .min(1, { message: '快速选择账号' })
        .optional()
        .default('vben'),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '请输入用户名',
      },
      dependencies: {
        trigger(values, form) {
          if (values.selectAccount) {
            const findUser = MOCK_USER_OPTIONS.find(
              (item) => item.value === values.selectAccount,
            );
            if (findUser) {
              form.setValues({
                password: '123456',
                username: findUser.value,
              });
            }
          }
        },
        triggerFields: ['selectAccount'],
      },
      fieldName: 'username',
      label: '账号',
      rules: z.string().min(1, { message: '请输入用户名' }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: '密码',
      },
      fieldName: 'password',
      label: '密码',
      rules: z.string().min(1, { message: '请输入密码' }),
    },
    {
      component: markRaw(SliderCaptcha),
      fieldName: 'captcha',
      rules: z.boolean().refine((value) => value, {
        message: '请先完成验证',
      }),
    },
  ];
});

const loginRef =
  useTemplateRef<InstanceType<typeof AuthenticationLogin>>('loginRef');

async function onSubmit(params: Recordable<any>) {
  authStore.authLogin(params).catch(() => {
    // 登陆失败，刷新验证码的演示

    // 使用表单API获取验证码组件实例，并调用其resume方法来重置验证码
    loginRef.value
      ?.getFormApi()
      ?.getFieldComponentRef<InstanceType<typeof SliderCaptcha>>('captcha')
      ?.resume();
  });
}
</script>

<template>
  <AuthenticationLogin
    ref="loginRef"
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="onSubmit"
  />
</template>
