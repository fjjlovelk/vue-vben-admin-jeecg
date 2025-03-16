import type { AnyFn } from '@vueuse/core';

export interface ActionItem {
  onClick?: AnyFn;
  label?: string;
  danger?: boolean;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  auth?: string[];
  ifShow?: ((action: ActionItem) => boolean) | boolean;
  // 自定义类名
  class?: any[] | Record<string, boolean> | string;
}
