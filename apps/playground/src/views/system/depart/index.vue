<script setup lang="ts">
import type { SystemDepartApi } from '#/api';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import DepartFormTab from './depart-form-tab.vue';
import DepartLeftTree from './depart-left-tree.vue';
import DepartRuleTab from './depart-rule-tab.vue';

defineOptions({
  name: 'SystemDepart',
});

const leftTree = ref();
const isLoading = ref(false);

// 当前选中的部门信息
const departData = ref<null | SystemDepartApi.GetDepartTreeSyncResult>(null);
const rootTreeData = ref<SystemDepartApi.GetDepartTreeSyncResult[]>([]);

// 左侧树选择后触发
const onTreeSelect = (data: SystemDepartApi.GetDepartTreeSyncResult) => {
  departData.value = data;
};

// 左侧树rootTreeData触发
const onRootTreeData = (data: SystemDepartApi.GetDepartTreeSyncResult[]) => {
  rootTreeData.value = data;
};

const toggleLoading = (value: boolean) => {
  isLoading.value = value;
};

const onSuccess = () => {
  leftTree.value.loadRootTreeData();
};
</script>

<template>
  <Page auto-content-height>
    <a-spin :spinning="isLoading">
      <a-row type="flex" :gutter="10">
        <a-col :xl="12" :lg="24" :md="24" class="mb-[10px]">
          <DepartLeftTree
            ref="leftTree"
            :is-loading="isLoading"
            @select="onTreeSelect"
            @root-tree-data="onRootTreeData"
            @loading="toggleLoading"
          />
        </a-col>
        <a-col :xl="12" :lg="24" :md="24" class="mb-[10px]">
          <a-card :bordered="false" class="h-full">
            <a-tabs v-show="departData != null" default-active-key="base-info">
              <a-tab-pane
                tab="基本信息"
                key="base-info"
                force-render
                class="relative"
              >
                <DepartFormTab
                  :is-loading="isLoading"
                  :data="departData"
                  :root-tree-data="rootTreeData"
                  @success="onSuccess"
                  @loading="toggleLoading"
                />
              </a-tab-pane>
              <a-tab-pane tab="部门权限" key="role-info">
                <DepartRuleTab
                  :is-loading="isLoading"
                  :data="departData"
                  @loading="toggleLoading"
                />
              </a-tab-pane>
            </a-tabs>
            <a-empty v-show="departData == null" description="尚未选择部门" />
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </Page>
</template>

<style scoped lang="scss">
:deep(.ant-card-body) {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
