import type { ExtendedVxeGridApi } from '@vben/plugins/vxe-table';

import { computed, ref, toRaw } from 'vue';

export function useTableCheckTip<T = any>() {
  // 已选择的行
  const checkedRows = ref<T[]>([]);

  const checkedRowsCount = computed<number>(() => checkedRows.value.length);

  let gridApi: ExtendedVxeGridApi | null = null;

  // 注册gridApi
  const registerGridApi = (realGridApi: ExtendedVxeGridApi) => {
    gridApi = realGridApi;
  };

  // 监听check
  const onCheckboxChange = () => {
    if (!gridApi) {
      console.error('gridApi未注册');
      return;
    }
    checkedRows.value = gridApi?.grid
      .getCheckboxRecords(true)
      .map((item) => toRaw(item));
  };

  // 清空选择
  const handleClearCheck = () => {
    if (!gridApi) {
      console.error('gridApi未注册');
      return;
    }
    checkedRows.value = [];
    gridApi.grid.clearCheckboxRow();
  };

  return {
    checkedRows,
    checkedRowsCount,
    registerGridApi,
    onCheckboxChange,
    handleClearCheck,
  };
}
