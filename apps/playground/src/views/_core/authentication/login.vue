<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form';

import { computed, onMounted, reactive, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { preferences } from '@vben/preferences';

import { getCaptchaApi } from '#/api';
import NotFoundCodeImage from '#/assets/images/not-found-code.png';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const appName = computed(() => preferences.app.name);

const authStore = useAuthStore();
const formModel = reactive({
  username: '',
  password: '',
  captcha: '',
  checkKey: -1,
});
const captchaCode = ref('');

const rules: Record<string, Rule[]> = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
  captcha: [{ required: true, message: '请输入验证码' }],
};

// 获取验证码
async function fetchCaptcha() {
  try {
    formModel.checkKey = Date.now();
    captchaCode.value = await getCaptchaApi(formModel.checkKey);
  } catch (error) {
    formModel.checkKey = -1;
    captchaCode.value = '';
    console.error(error);
  }
}

// 登录
function handleSubmit() {
  if (authStore.loginLoading) {
    return;
  }
  authStore.authLogin(formModel, undefined, () => {
    fetchCaptcha();
  });
}

onMounted(() => {
  fetchCaptcha();
});
</script>

<template>
  <div class="login-background h-full w-full">
    <div
      class="shadow-float shadow-primary/5 flex-center absolute left-1/2 top-1/2 w-[550px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-3xl bg-white p-8"
    >
      <div class="text-2xl font-bold">{{ appName }}</div>
      <a-form
        class="mt-10 w-full"
        :model="formModel"
        :rules="rules"
        @finish="handleSubmit"
      >
        <a-form-item name="username">
          <a-input
            v-model:value="formModel.username"
            size="large"
            autocomplete="off"
            placeholder="请输入用户名"
            allow-clear
          >
            <template #prefix>
              <IconifyIcon icon="carbon:user" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password
            v-model:value="formModel.password"
            size="large"
            autocomplete="off"
            placeholder="请输入密码"
            allow-clear
          >
            <template #prefix>
              <IconifyIcon icon="carbon:locked" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item name="captcha">
          <a-input
            v-model:value="formModel.captcha"
            size="large"
            placeholder="请输入验证码"
            allow-clear
          >
            <template #prefix>
              <IconifyIcon icon="carbon:code" />
            </template>
            <template #addonAfter>
              <img
                class="!h-[35px] !w-[105px] max-w-none cursor-pointer"
                :src="captchaCode ? captchaCode : NotFoundCodeImage"
                alt="not found"
                @click="fetchCaptcha"
              />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            :loading="authStore.loginLoading"
            html-type="submit"
            type="primary"
            size="large"
            block
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style scoped>
.login-background {
  background: linear-gradient(
    154deg,
    #07070915 30%,
    hsl(var(--primary) / 30%) 48%,
    #07070915 64%
  );
}

.dark {
  .login-background {
    background: linear-gradient(
      154deg,
      #07070915 30%,
      hsl(var(--primary) / 20%) 48%,
      #07070915 64%
    );
  }
}

:deep(.ant-input-group-addon) {
  padding: 0;
}
</style>
