import type {
  AntdFormProps,
  VxeGridProps,
  VxeTableGridOptions,
} from '@vben/common-ui';

import type { SystemMenuApi } from '#/api/system/menu';

import { getPermissionListApi } from '#/api/system/menu';

// 菜单列表查询表单
export const menuQueryFormConfig: AntdFormProps = {
  schema: [
    {
      component: 'Input',
      label: '菜单名称',
      fieldName: 'name',
    },
  ],
};

// 菜单列表column
export const menuColumns: VxeTableGridOptions<SystemMenuApi.GetPermissionListResult>['columns'] =
  [
    { type: 'checkbox', width: 50 },
    {
      title: '菜单名称',
      field: 'name',
      treeNode: true,
      align: 'left',
      headerAlign: 'center',
    },
    { title: '图标', field: 'icon', width: 50, slots: { default: 'icon' } },
    { title: '组件', field: 'component' },
    { title: '路径', field: 'url' },
    { title: '排序', field: 'sortNo', width: 50 },
    { title: '操作', width: 160, fixed: 'right', slots: { default: 'action' } },
  ];

// 表格配置项
export const menuGridOptions: VxeGridProps<SystemMenuApi.GetPermissionListResult> =
  {
    keepSource: true,
    treeConfig: {},
    pagerConfig: {
      enabled: false,
    },
    toolbarConfig: {
      slots: {
        buttons: 'toolbar_buttons',
      },
    },
    proxyConfig: {
      ajax: {
        query: async (_, formValues) => {
          const { result } = await getPermissionListApi(formValues);
          return result;
        },
      },
    },
    columns: menuColumns,
  };

// 新增/编辑菜单 表单
export const menuDrawerFormConfig: AntdFormProps = {
  commonConfig: {
    labelWidth: 100,
  },
  showDefaultActions: false,
  schema: [
    {
      label: '菜单类型',
      fieldName: 'menuType',
      component: 'RadioGroup',
      defaultValue: 0,
      rules: 'required',
      componentProps: {
        buttonStyle: 'solid',
        optionType: 'button',
        options: [
          { label: '一级菜单', value: 0 },
          { label: '二级菜单', value: 1 },
          { label: '按钮/权限', value: 2 },
        ],
      },
    },
    {
      label: '菜单名称',
      fieldName: 'name',
      rules: 'required',
      component: 'Input',
    },
    {
      label: '上级菜单',
      fieldName: 'parentId',
      rules: 'required',
      component: 'ApiTreeSelect',
      componentProps: {
        api: async () => {
          const { result } = await getPermissionListApi();
          return result;
        },
        class: 'w-full',
        labelField: 'title',
        valueField: 'id',
        childrenField: 'children',
      },
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType === 1 || values.menuType === 2,
      },
    },
    {
      label: '访问路径',
      fieldName: 'url',
      rules: 'required',
      defaultValue: '',
      component: 'Input',
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType !== 2,
      },
    },
    {
      label: '授权标识',
      fieldName: 'perms',
      rules: 'required',
      defaultValue: '',
      component: 'Input',
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType === 2,
      },
    },
    {
      label: '授权策略',
      fieldName: 'permsType',
      component: 'RadioGroup',
      help: `可见/可访问(授权后可见/可访问)\n可编辑(未授权时禁用)`,
      defaultValue: '1',
      componentProps: {
        options: [
          { label: '可见/可访问', value: '1' },
          { label: '可编辑', value: '2' },
        ],
      },
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType === 2,
      },
    },
    {
      label: '状态',
      fieldName: 'status',
      component: 'RadioGroup',
      defaultValue: '1',
      componentProps: {
        options: [
          { label: '有效', value: '1' },
          { label: '无效', value: '0' },
        ],
      },
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType === 2,
      },
    },
    {
      label: '前端组件',
      fieldName: 'component',
      rules: 'required',
      defaultValue: '',
      component: 'Input',
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType !== 2,
      },
    },
    {
      label: '组件名称',
      fieldName: 'componentName',
      defaultValue: '',
      component: 'Input',
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType !== 2,
      },
    },
    {
      label: '默认跳转地址',
      fieldName: 'redirect',
      component: 'Input',
      defaultValue: '',
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType === 0,
      },
    },
    {
      label: '菜单图标',
      fieldName: 'icon',
      component: 'IconPicker',
      defaultValue: '',
      componentProps: {
        prefix: 'carbon',
        class: 'w-full',
      },
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType !== 2,
      },
    },
    {
      label: '排序',
      fieldName: 'sortNo',
      component: 'InputNumber',
      defaultValue: 1,
      componentProps: {
        min: 0,
      },
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType !== 2,
      },
    },
    {
      label: '是否路由菜单',
      fieldName: 'route',
      component: 'Switch',
      defaultValue: true,
      componentProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType !== 2,
      },
    },
    {
      label: '隐藏路由',
      fieldName: 'hidden',
      component: 'Switch',
      defaultValue: 0,
      componentProps: {
        checkedChildren: '是',
        checkedValue: 1,
        unCheckedChildren: '否',
        unCheckedValue: 0,
      },
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType !== 2,
      },
    },
    {
      label: '隐藏Tab',
      fieldName: 'hideTab',
      component: 'Switch',
      defaultValue: 0,
      componentProps: {
        checkedChildren: '是',
        checkedValue: 1,
        unCheckedChildren: '否',
        unCheckedValue: 0,
      },
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType !== 2,
      },
    },
    {
      label: '是否缓存路由',
      fieldName: 'keepAlive',
      component: 'Switch',
      defaultValue: true,
      componentProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType !== 2,
      },
    },
    {
      label: '聚合路由',
      fieldName: 'alwaysShow',
      component: 'Switch',
      defaultValue: false,
      componentProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType !== 2,
      },
    },
    {
      label: '打开方式',
      fieldName: 'internalOrExternal',
      component: 'Switch',
      defaultValue: false,
      componentProps: {
        checkedChildren: '外部',
        unCheckedChildren: '内部',
      },
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType !== 2,
      },
    },
  ],
};
