<template>
  <n-split
      v-if="useTypeManager.stateMap.has(projectId)"
      v-model:size="useTypeManager.stateMap.get(projectId).splitSize"
      class="h-full"
      direction="horizontal"
      min="150px"
      max="400px"
      default-size="200px"
  >
    <template #1>
      <DatabaseManagerMenu :projectId="projectId" class="relative top-2 left-2 right-4"/>
    </template>
    <template #2>
      <div class="relative top-2 left-2 right-4 bottom-2 w-full pr-3">
        <n-tabs
            id="model-tabs"
            v-model:value="useTypeManager.stateMap.get(projectId).activeTabKey"
            type="card"
            :size="'small'"
            :addable="false"
            :closable="true"
            tab-style="min-width: 80px;padding-left: 8px;"
            :animated="true"
            @close="handleTabClose"
            @update:value="handleActiveTabKeyUpdate"
        >
          <n-tab-pane v-for="options in useTypeManager.getTabPanels(projectId)"
                      :key="options.panelOptions.key"
                      :name="options.panelOptions.key"
          >
            <template #tab>
              <div
                  v-show="useTypeManager.stateMap.get(projectId).activeTabKey == options.panelOptions.key"
                  class="absolute top-[-2px] left-0 right-0 h-1 border-b-2"
                  :style="{ borderColor: 'var(--n-tab-text-color-active)'}"
              />
              <n-flex :size="6" class="justify-center items-center select-none">
                <n-tag v-if="options.panelOptions.tag" :bordered="false" type="info" size="small">
                  {{ options.panelOptions.tag }}
                </n-tag>
                <n-text class="text-xs">{{ options.panelOptions.label }}</n-text>
              </n-flex>
            </template>
            <template #default>
              <component
                  v-if="panelComponentMap[options.panelOptions.type]"
                  :is="panelComponentMap[options.panelOptions.type]"
                  :projectId="projectId"
                  :modelOptions="options.modelOptions"
              />
            </template>
          </n-tab-pane>
        </n-tabs>
      </div>
      <n-flex
          v-if="useTypeManager.getTabPanels(projectId).length == 0"
          class="select-none relative"
          style="height: 100%; display: flex; justify-content: center; align-items: center;"
          vertical>
        <n-icon :size="200">
          <img src="@render/assets/logo.png" alt="" class="filter-grayscale-50 opacity-20">
        </n-icon>
        <n-button secondary class="mt-10" @click=handleOpenOverview>
          <template #icon>
            <n-text depth="3">
              <div class="i-ph:navigation-arrow"/>
            </n-text>
          </template>
          <n-text depth="3">打开项目总览</n-text>
        </n-button>
      </n-flex>
    </template>
  </n-split>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {computed} from "vue";
import ModelOverview from "@render/components/project/modelManager/tabPanel/ModelOverview.vue";
import DataTableModel from "@render/components/DataTableModelPanel/index.vue";
import {useTypeManagerStore} from "@render/stores/useTypeManager";
import DataTypeEditor from "@render/components/project/typeManager/tabPanel/DataTypeEditor.vue";
import DatabaseManagerMenu from "@render/components/project/databaseManager/DatabaseManagerMenu.vue";

defineOptions({name: 'ProjectDatabaseManager'})

const route = useRoute()
const projectId = computed(() => parseInt(route.query.projectId as string))
const useTypeManager = useTypeManagerStore()

const panelComponentMap = {
  overview: ModelOverview,
  datatable: DataTableModel,
  datatype: DataTypeEditor,
}

const handleTabClose = (key: string) => {
  useTypeManager.removeTabPanel(projectId.value, key)
}

const handleOpenOverview = () => {

}

const handleActiveTabKeyUpdate = (value: string) => {
  useTypeManager.updateGroupMenuSelectedKey(projectId.value, value)
}

</script>
