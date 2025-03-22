import type { Component } from 'vue';

import type { Recordable } from '@vben/types';

import type { BaseFormComponentType } from '@vben-core/form-ui';

import { defineComponent, getCurrentInstance, h, ref } from 'vue';

import { globalShareState } from '@vben-core/shared/global-state';

import {
  AutoComplete,
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  InputPassword,
  InputSearch,
  Mentions,
  MonthPicker,
  notification,
  QuarterPicker,
  Radio,
  RadioGroup,
  RangePicker,
  Rate,
  Select,
  Slider,
  Space,
  Switch,
  Textarea,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  WeekPicker,
} from 'ant-design-vue';

import { ApiComponent } from '../api-component';
import { AsyncTreeSelect } from '../async-tree-select';
import { IconPicker } from '../icon-picker';

const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
) => {
  return defineComponent({
    inheritAttrs: false,
    name: component.name,
    setup: (props: any, { attrs, expose, slots }) => {
      const placeholder =
        props?.placeholder || attrs?.placeholder || type === 'input'
          ? '请输入'
          : '请选择';
      // 透传组件暴露的方法
      const innerRef = ref();
      const publicApi: Recordable<any> = {};
      expose(publicApi);
      const instance = getCurrentInstance();
      instance?.proxy?.$nextTick(() => {
        for (const key in innerRef.value) {
          if (typeof innerRef.value[key] === 'function') {
            publicApi[key] = innerRef.value[key];
          }
        }
      });
      return () =>
        h(
          component,
          { allowClear: true, ...props, ...attrs, placeholder, ref: innerRef },
          slots,
        );
    },
  });
};

// 这里需要自行根据业务组件库进行适配，需要用到的组件都需要在这里类型说明
export type AntdComponentType =
  | 'ApiSelect'
  | 'ApiTreeSelect'
  | 'AsyncTreeSelect'
  | 'AutoComplete'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'DefaultButton'
  | 'Divider'
  | 'IconPicker'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'InputSearch'
  | 'Mentions'
  | 'MonthPicker'
  | 'PrimaryButton'
  | 'QuarterPicker'
  | 'Radio'
  | 'RadioGroup'
  | 'RangePicker'
  | 'Rate'
  | 'Select'
  | 'Slider'
  | 'Space'
  | 'Switch'
  | 'Textarea'
  | 'TimePicker'
  | 'Transfer'
  | 'TreeSelect'
  | 'Upload'
  | 'WeekPicker'
  | BaseFormComponentType;

async function initComponentAdapter() {
  const components: Partial<Record<AntdComponentType, Component>> = {
    // 如果你的组件体积比较大，可以使用异步加载
    // Button: () =>
    // import('xxx').then((res) => res.Button),

    ApiSelect: (props, { attrs, slots }) => {
      return h(
        ApiComponent,
        {
          placeholder: '请选择',
          allowClear: true,
          ...props,
          ...attrs,
          component: Select,
          loadingSlot: 'suffixIcon',
          modelPropName: 'value',
          visibleEvent: 'onVisibleChange',
        },
        slots,
      );
    },
    ApiTreeSelect: (props, { attrs, slots }) => {
      return h(
        ApiComponent,
        {
          placeholder: '请选择',
          allowClear: true,
          ...props,
          ...attrs,
          component: TreeSelect,
          fieldNames: { label: 'label', value: 'value', children: 'children' },
          loadingSlot: 'suffixIcon',
          modelPropName: 'value',
          optionsPropName: 'treeData',
          visibleEvent: 'onVisibleChange',
        },
        slots,
      );
    },
    AutoComplete,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    // 自定义默认按钮
    DefaultButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'default' }, slots);
    },
    AsyncTreeSelect,
    Divider,
    IconPicker: (props, { attrs, slots }) => {
      return h(
        IconPicker,
        {
          iconSlot: 'addonAfter',
          inputComponent: Input,
          modelValueProp: 'value',
          ...props,
          ...attrs,
        },
        slots,
      );
    },
    Input: withDefaultPlaceholder(Input, 'input'),
    InputNumber: withDefaultPlaceholder(InputNumber, 'input'),
    InputPassword: withDefaultPlaceholder(InputPassword, 'input'),
    InputSearch: withDefaultPlaceholder(InputSearch, 'input'),
    Mentions: withDefaultPlaceholder(Mentions, 'input'),
    MonthPicker,
    QuarterPicker,
    // 自定义主要按钮
    PrimaryButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'primary' }, slots);
    },
    Radio,
    RadioGroup,
    RangePicker,
    Rate,
    Select: withDefaultPlaceholder(Select, 'select'),
    Slider,
    Space,
    Switch,
    Textarea: withDefaultPlaceholder(Textarea, 'input'),
    TimePicker,
    Transfer,
    TreeSelect: withDefaultPlaceholder(TreeSelect, 'select'),
    Upload,
    WeekPicker,
  };

  // 将组件注册到全局共享状态中
  globalShareState.setComponents(components);

  // 定义全局共享状态中的消息提示
  globalShareState.defineMessage({
    // 复制成功消息提示
    copyPreferencesSuccess: (title, content) => {
      notification.success({
        description: content,
        message: title,
        placement: 'bottomRight',
      });
    },
  });
}

export { initComponentAdapter };
