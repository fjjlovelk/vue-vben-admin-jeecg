import type { AntdFormSchema, VxeTableGridOptions } from '@vben/common-ui';

import type { MonitorLogApi } from '#/api';

import { useAccessStore } from '@vben/stores';

const accessStore = useAccessStore();

// 日志列表查询表单
export const logQueryFormSchema: AntdFormSchema[] = [
  {
    component: 'Input',
    label: '日志类型',
    fieldName: 'logType',
    dependencies: {
      triggerFields: ['any'],
      show: false,
    },
  },
  {
    component: 'Input',
    label: '搜索日志',
    fieldName: 'keyWord',
  },
  {
    component: 'RangePicker',
    label: '创建时间',
    fieldName: 'fieldTime',
  },
  {
    component: 'Select',
    label: '操作类型',
    fieldName: 'operateType',
    componentProps: {
      options: accessStore.sysAllDictItems.operate_type || [],
    },
    dependencies: {
      triggerFields: ['logType'],
      show: (value) => value.logType === '2',
    },
  },
];

// 日志列表column
export const logColumns: VxeTableGridOptions<MonitorLogApi.GetLogListResult>['columns'] =
  [
    { type: 'expand', width: 40, slots: { content: 'expand_content' } },
    {
      title: '日志内容',
      field: 'logContent',
      align: 'left',
      headerAlign: 'center',
    },
    {
      title: '操作人ID',
      field: 'userid',
      width: 80,
    },
    {
      title: '操作人',
      field: 'username',
      width: 140,
    },
    {
      title: 'IP',
      field: 'ip',
      width: 140,
    },
    {
      title: '耗时(毫秒)',
      field: 'costTime',
      width: 100,
    },
    {
      title: '创建时间',
      field: 'createTime',
      width: 160,
    },
    {
      title: '客户端类型',
      field: 'clientType_dictText',
      width: 100,
    },
  ];

// 操作日志
export const operationLogColumns: VxeTableGridOptions<MonitorLogApi.GetLogListResult>['columns'] =
  [
    ...logColumns,
    {
      title: '操作类型',
      field: 'operateType_dictText',
      width: 80,
    },
  ];

// 异常日志
export const exceptionLogColumns: VxeTableGridOptions<MonitorLogApi.GetLogListResult>['columns'] =
  [
    {
      title: '异常标题',
      field: 'logContent',
      align: 'left',
      headerAlign: 'center',
    },
    {
      title: '请求地址',
      field: 'requestUrl',
      width: 100,
    },
    {
      title: '请求参数',
      field: 'method',
      width: 100,
    },
    {
      title: '操作人',
      field: 'username',
      width: 140,
      formatter: ({ row }) => {
        const name = row.username;
        const pid = row.userid;
        if (!name && !pid) {
          return '';
        }
        return `${name} (账号: ${pid} )`;
      },
    },
    {
      title: 'IP',
      field: 'ip',
      width: 140,
    },
    {
      title: '创建时间',
      field: 'createTime',
      width: 160,
    },
    {
      title: '客户端类型',
      field: 'clientType_dictText',
      width: 100,
    },
  ];
