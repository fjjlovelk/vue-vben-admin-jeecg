import type { Recordable } from '@vben/types';

export type BasicUploadResponseData = Recordable<any> & { url: string };

export type BasicUploadApiParams = Recordable<any> & {
  file: Blob | File;
  name: string;
};

export type BasicUploadApiProgress = (progressEvent: ProgressEvent) => void;

export type BasicUploadApi = (
  params: BasicUploadApiParams,
  progressEvent: BasicUploadApiProgress,
) => PromiseLike<BasicUploadResponseData>;

export interface BasicUploadModalProps {
  helpText?: string;
  // 文件最大多少MB
  maxSize?: number;
  // 最大数量
  maxCount?: number;
  accept?: string[];
  multiple?: boolean;
  // 上传参数
  uploadParams?: Recordable<unknown>;
  api: BasicUploadApi;
  name?: string;
}

export interface BasicUploadProps extends BasicUploadModalProps {
  modelValue: string[];
  // 是否显示预览数
  showPreviewNumber?: boolean;
  // 文件为0时隐藏预览数
  emptyHidePreview?: boolean;
}

export enum BasicUploadResultStatus {
  ERROR = 'error',
  SUCCESS = 'success',
  UPLOADING = 'uploading',
}

export interface BasicUploadFileItem {
  thumbUrl?: string;
  name: string;
  size: number | string;
  type?: string;
  percent: number;
  file: File;
  status?: BasicUploadResultStatus;
  responseData?: BasicUploadResponseData;
  uuid: string;
}

export interface BasicUploadPreviewFileItem {
  url: string;
  name: string;
  type: string;
}
