import type { SizeType } from 'ant-design-vue/es/config-provider/context';
import type { DataNode, Key } from 'ant-design-vue/es/vc-tree/interface';

import type { AnyFunction, AnyPromiseFunction, Recordable } from '@vben/types';

export type FetchTreeApiType = AnyPromiseFunction<
  Recordable<any>[],
  DataNode[]
>;

export type FetchLabelApiType = (
  idList: Key[],
  ...arg: any[]
) => PromiseLike<DataNode[]>;

export type AsyncTreeSelectModalParams =
  | AnyFunction<any, Recordable<any>>
  | Recordable<any>;

export interface AsyncTreeSelectModalProps {
  // 弹框标题
  modalTitle?: string;
  // 是否多选
  multiple?: boolean;
  // 最大高度
  maxHeight?: number;
  // 是否父子关联
  checkStrictly?: boolean;
  // 异步获取数据方法
  fetchTreeApi?: FetchTreeApiType;
  // 接口参数
  params?: AsyncTreeSelectModalParams;
  labelField?: string;
  valueField?: string;
  childrenField?: string;
}

export interface AsyncTreeSelectProps extends AsyncTreeSelectModalProps {
  modelValue?: Key[];
  placeholder?: string;
  size?: SizeType;
  disabled?: boolean;
  // 最多显示多少个已选项
  maxTagCount?: number;
  // 根据选择的数据id获取完整数据方法
  fetchLabelApi: FetchLabelApiType;
  // 是否缓存
  cacheable?: boolean;
}
