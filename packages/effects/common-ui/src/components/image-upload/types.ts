import type { UploadProps } from 'ant-design-vue';

import type { Recordable } from '@vben/types';

export interface ImageUploadProps {
  // 上传地址
  action: string;
  // 上传参数
  data?: UploadProps['data'];
  // 禁用
  disabled?: boolean;
  headers?: UploadProps['headers'];
  // 列表样式
  listType?: UploadProps['listType'];
  // 上传数量
  maxCount?: number;
  modelValue?: string | string[];
  // 按钮文字
  text?: string;
  // 处理响应数据
  getResponse?: (data: Recordable<unknown>) => string;
}
