const BasicLayout = () => import('./basic.vue');
const AuthPageLayout = () => import('./auth.vue');

const IFrameView = () => import('@vben/layouts').then((m) => m.IFrameView);
const BlankPageLayout = () =>
  import('@vben/layouts').then((m) => m.BlankPageLayout);

export { AuthPageLayout, BasicLayout, BlankPageLayout, IFrameView };
