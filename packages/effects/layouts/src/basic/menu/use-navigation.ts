import type { RouteRecordNormalized } from 'vue-router';

import { useRouter } from 'vue-router';

import { isHttpUrl, openRouteInNewWindow, openWindow } from '@vben/utils';

function useNavigation() {
  const router = useRouter();
  const routes = router.getRoutes();

  const routeMetaMap = new Map<string, RouteRecordNormalized>();

  routes.forEach((route) => {
    routeMetaMap.set(route.path, route);
  });

  const navigation = async (path: string) => {
    const route = routeMetaMap.get(path);
    const {
      internalOrExternal = false,
      query = {},
      url = '',
    } = route?.meta ?? {};
    if (isHttpUrl(path)) {
      openWindow(path, { target: '_blank' });
    } else if (internalOrExternal) {
      openRouteInNewWindow(url || path);
    } else {
      await router.push({
        path,
        query,
      });
    }
  };

  return { navigation };
}

export { useNavigation };
