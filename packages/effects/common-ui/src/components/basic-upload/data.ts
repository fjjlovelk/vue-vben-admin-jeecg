import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';
import type { UserInfo } from '@vben/types';

export const basicUploadModalColumn: VxeTableGridOptions<UserInfo>['columns'] =
  [
    {
      title: '略缩图',
      field: 'thumbUrl',
      width: 100,
      slots: { default: 'thumbUrl' },
    },
    {
      title: '文件名',
      field: 'name',
      align: 'left',
      headerAlign: 'center',
      slots: { default: 'name' },
    },
    {
      title: '文件大小',
      field: 'size',
      width: 80,
      slots: { default: 'size' },
    },
    {
      title: '状态',
      field: 'status',
      width: 80,
      slots: { default: 'status' },
    },
    { title: '操作', width: 70, fixed: 'right', slots: { default: 'action' } },
  ];

export const basicUploadPreviewModalColumn: VxeTableGridOptions<UserInfo>['columns'] =
  [
    {
      title: '略缩图',
      field: 'url',
      width: 100,
      slots: { default: 'url' },
    },
    {
      title: '文件名',
      field: 'name',
      align: 'left',
      headerAlign: 'center',
    },
    { title: '操作', width: 120, fixed: 'right', slots: { default: 'action' } },
  ];
