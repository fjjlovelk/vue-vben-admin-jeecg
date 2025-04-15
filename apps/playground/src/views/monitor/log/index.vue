<script setup lang="ts">
import type { VxeGridProps } from '@vben/common-ui';

import type { MonitorLogApi } from '#/api';

import { ref } from 'vue';

import { Page, useVbenVxeGrid } from '@vben/common-ui';

import { getLogListApi } from '#/api';

import {
  exceptionLogColumns,
  logColumns,
  logQueryFormSchema,
  operationLogColumns,
} from './log.data';

defineOptions({
  name: 'MonitorLog',
});

const logType = ref('4');

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    commonConfig: {
      labelWidth: 70,
    },
    schema: logQueryFormSchema,
    fieldMappingTime: [
      ['fieldTime', ['createTime_begin', 'createTime_end'], 'YYYY-MM-DD'],
    ],
  },
  gridOptions: {
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          if (logType.value !== '2') {
            delete formValues.operateType;
          }
          return await getLogListApi({
            column: 'createTime',
            order: 'desc',
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
            logType: logType.value,
          });
        },
      },
    },
    columns: logColumns,
  } as VxeGridProps<MonitorLogApi.GetLogListResult>,
});

const tabChange = (key: string) => {
  logType.value = key;
  gridApi.formApi.setFieldValue('logType', key);
  if (key === '2') {
    // 操作日志
    gridApi.setGridOptions({
      columns: operationLogColumns,
    });
  } else if (key === '4') {
    // 异常日志
    gridApi.setGridOptions({
      columns: exceptionLogColumns,
    });
  } else {
    // 登录日志
    gridApi.setGridOptions({
      columns: logColumns,
    });
  }
  gridApi.formApi.submitForm();
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <a-tabs default-active-key="4" @change="tabChange" size="small">
          <a-tab-pane tab="异常日志" key="4" />
          <a-tab-pane tab="登录日志" key="1" />
          <a-tab-pane tab="操作日志" key="2" />
        </a-tabs>
      </template>
      <template #expand_content="{ row }">
        <template v-if="logType === '2'">
          <div class="m-[5px]">
            <a-badge status="success" class="align-middle" />
            <span class="align-middle"> 请求方法:{{ row.method }} </span>
          </div>
          <div class="m-[5px]">
            <a-badge status="processing" class="align-middle" />
            <span class="align-middle"> 请求参数:{{ row.requestParam }} </span>
          </div>
        </template>
        <template v-else-if="logType === '4'">
          <div class="m-[5px]">
            <a-badge status="success" class="align-middle" />
            <span class="whitespace-break-spaces break-words align-middle">
              异常堆栈:{{ row.requestParam }}
            </span>
          </div>
        </template>
      </template>
    </Grid>
  </Page>
</template>

<style scoped lang="sass"></style>
