import type { AntdComponentType } from '@vben/common-ui';

import { createApp, watchEffect } from 'vue';

import { registerAccessDirective } from '@vben/access';
import {
  antdFormConfig,
  initComponentAdapter,
  initTippy,
  registerLoadingDirective,
  setupAntdForm,
} from '@vben/common-ui';
import { MotionPlugin } from '@vben/plugins/motion';
import { preferences } from '@vben/preferences';
import { initStores } from '@vben/stores';
import '@vben/styles';
import '@vben/styles/antd';

import { VueQueryPlugin } from '@tanstack/vue-query';
import { useTitle } from '@vueuse/core';
import Antd from 'ant-design-vue';

import { router } from '#/router';

import App from './app.vue';

// import 'ant-design-vue/dist/reset.css';

async function bootstrap(namespace: string) {
  // 初始化组件适配器
  await initComponentAdapter();
  setupAntdForm<AntdComponentType>(antdFormConfig);

  // // 设置弹窗的默认配置
  // setDefaultModalProps({
  //   fullscreenButton: false,
  // });
  // // 设置抽屉的默认配置
  // setDefaultDrawerProps({
  //   // zIndex: 1020,
  // });

  const app = createApp(App);

  // 注册v-loading指令
  registerLoadingDirective(app, {
    loading: 'loading', // 在这里可以自定义指令名称，也可以明确提供false表示不注册这个指令
    spinning: 'spinning',
  });

  // 配置 pinia-tore
  await initStores(app, { namespace });

  // 安装权限指令
  registerAccessDirective(app);

  // 初始化 tippy
  initTippy(app);

  // 配置路由及路由守卫
  app.use(router);

  app.use(Antd);

  // 配置@tanstack/vue-query
  app.use(VueQueryPlugin);

  // 配置Motion插件
  app.use(MotionPlugin);

  // 动态更新标题
  watchEffect(() => {
    if (preferences.app.dynamicTitle) {
      const routeTitle = router.currentRoute.value.meta?.title;
      const pageTitle =
        (routeTitle ? `${routeTitle} - ` : '') + preferences.app.name;
      useTitle(pageTitle);
    }
  });

  app.mount('#app');
}

export { bootstrap };
