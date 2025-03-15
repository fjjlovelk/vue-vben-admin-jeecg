import type {
  VbenFormSchema as FormSchema,
  VbenFormAdapterOptions,
  VbenFormProps,
} from '@vben-core/form-ui';

import type { AntdComponentType } from './component';

import { setupVbenForm, useVbenForm } from '@vben-core/form-ui';

const antdFormConfig: VbenFormAdapterOptions = {
  config: {
    // ant design vue组件库默认都是 v-model:value
    baseModelPropName: 'value',
    // 一些组件是 v-model:checked 或者 v-model:fileList
    modelPropNameMap: {
      Checkbox: 'checked',
      Radio: 'checked',
      Switch: 'checked',
      Upload: 'fileList',
    },
  },
  defineRules: {
    // 输入项目必填国际化适配
    required: (value, _params, ctx) => {
      if (value === undefined || value === null || value.length === 0) {
        return `请输入${ctx.label}`;
      }
      return true;
    },
    // 选择项目必填国际化适配
    selectRequired: (value, _params, ctx) => {
      if (value === undefined || value === null) {
        return `"请选择${ctx.label}`;
      }
      return true;
    },
  },
};

const useAntdForm = useVbenForm<AntdComponentType>;

type AntdFormProps = VbenFormProps<AntdComponentType>;

export { antdFormConfig, setupVbenForm as setupAntdForm, useAntdForm };

export type AntdFormSchema = FormSchema<AntdComponentType>;
export type { AntdComponentType, AntdFormProps };

export { initComponentAdapter } from './component';
