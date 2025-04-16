import type { RouteRecordRaw } from 'vue-router';

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@vben/constants';

import { BlankPageLayout } from '#/layouts';

const BasicLayout = () => import('#/layouts/basic.vue');

/** 全局404页面 */
const fallbackNotFoundRoute: RouteRecordRaw = {
  component: () => import('#/views/_core/fallback/not-found.vue'),
  meta: {
    hideInBreadcrumb: true,
    hideMenu: true,
    hideTab: true,
    title: '404',
  },
  name: 'FallbackNotFound',
  path: '/:path(.*)*',
};

/** 基本路由，这些路由是必须存在的 */
const coreRoutes: RouteRecordRaw[] = [
  /**
   * 根路由
   * 使用基础布局，作为所有页面的父级容器，子级就不必配置BasicLayout。
   * 此路由必须存在，且不应修改
   */
  {
    component: BasicLayout,
    meta: {
      hideInBreadcrumb: true,
      title: 'Root',
    },
    name: 'Root',
    path: '/',
    redirect: DEFAULT_HOME_PATH,
    children: [],
  },
  {
    component: BlankPageLayout,
    meta: {
      hideTab: true,
      title: 'Fallback',
    },
    name: 'Fallback',
    path: '/fallback',
    children: [
      {
        component: () => import('#/views/_core/fallback/internal-error.vue'),
        meta: {
          hideInBreadcrumb: true,
          hideMenu: true,
          hideTab: true,
          title: '出错了',
        },
        name: 'FallbackInternalError',
        path: 'internal-error',
      },
    ],
  },
  {
    component: BlankPageLayout,
    meta: {
      hideTab: true,
      title: 'Authentication',
    },
    name: 'Authentication',
    path: '/auth',
    redirect: LOGIN_PATH,
    children: [
      {
        name: 'Login',
        path: 'login',
        component: () => import('#/views/_core/authentication/login.vue'),
        meta: {
          title: '登录',
        },
      },
    ],
  },
];

export { coreRoutes, fallbackNotFoundRoute };
