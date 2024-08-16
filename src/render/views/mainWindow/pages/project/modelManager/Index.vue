<template>
  <n-split
      v-if="useProjectPage.projectStateMap.has(projectId)"
      v-model:size="useProjectPage.projectStateMap.get(projectId).splitSize"
      class="h-full"
      direction="horizontal"
      max="300px"
      default-size="200px"
  >
    <template #1>
      <ModelManagerMenu :projectId="projectId" class="relative top-2 left-2 right-4"/>
    </template>
    <template #2>
      <div class="relative top-2 left-2 right-4 bottom-2 w-full pr-3">
        <n-tabs
            id="model-tab"
            v-model:value="useProjectPage.projectStateMap.get(projectId).modelActiveTabKey"
            type="card"
            :size="'small'"
            :addable="false"
            :closable="true"
            tab-style="min-width: 80px;"
            :animated="true"
            @close="handleTabClose"
            @update:value="handleActiveTabKeyUpdate"
        >
          <n-tab-pane v-for="panel in useProjectPage.projectStateMap.get(projectId).modelTabPanels" :key="panel.key"
                      :name="panel.key">
            <template #tab>
              <n-flex :size="6" class="justify-center items-center select-none">
                <n-tag v-if="panel.tag" :bordered="false" type="info" size="small">
                  {{ panel.tag }}
                </n-tag>
                <n-text class="text-xs">{{ panel.label }}</n-text>
              </n-flex>
            </template>
            <template #default>
              <component
                  v-if="panelComponentMap[panel.type]"
                  :is="panelComponentMap[panel.type]"
                  :projectId="projectId"
                  :panel="panel"
              />
            </template>
          </n-tab-pane>
        </n-tabs>
      </div>
      <n-flex
          v-if="useProjectPage.projectStateMap.get(projectId).modelTabPanels.length == 0"
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
import {useProjectPageStore} from "@render/stores/useProjectPage";
import ModelManagerMenu from "@render/components/project/modelManager/ModelManagerMenu.vue";
import ModelOverview from "@render/components/project/modelManager/tabPanel/ModelOverview.vue";
import DataTableModel from "@render/components/project/modelManager/tabPanel/DataTableModel.vue";

defineOptions({name: 'ProjectModelManager'})

const route = useRoute()
const projectId = computed(() => parseInt(route.query.projectId as string))
const useProjectPage = useProjectPageStore()

const panelComponentMap = {
  overview: ModelOverview,
  datatable: DataTableModel
}

const handleTabClose = (key: string) => {
  useProjectPage.removeModelTabPanel(projectId.value, key)
}

const handleOpenOverview = () => {
  useProjectPage.activeModelTabPanel(projectId.value, {
    key: 'overview',
    tag: '总览',
    label: '项目总览',
    type: 'overview'
  })
}

const handleActiveTabKeyUpdate = (value: string) => {
  useProjectPage.projectStateMap.get(projectId.value).groupMenuSelectedKey = value
}

</script>

<style scoped lang="less">
#model-tab:deep(.n-tabs-tab) {
  padding-left: 8px;
}

#model-tab:deep(.n-tabs-tab-pad) {
  width: 0;
}

#model-tab:deep(.n-tabs-tab--active) {
  border-top: solid var(--n-tab-text-color-active);
}
</style>
