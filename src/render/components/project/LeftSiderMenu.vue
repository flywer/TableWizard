<template>
  <n-menu
      v-if="useProjectPage.projectStateMap.has(projectId)"
      v-model:value="useProjectPage.projectStateMap.get(projectId).activeSideMenuItemKey"
      id="side-menu"
      class="w-20 pt-2"
      :options="menuOptions"
      draggable="false"
  />
</template>

<script setup lang="ts">
import type {MenuOption} from 'naive-ui'
import {h} from "vue";
import {RouterLink} from "vue-router";
import {RouteName} from "@common/constants/app/RouteName";
import {useProjectPageStore} from "@render/stores/useProjectPage";
import ProjectPageMenuItem from "@render/components/project/ProjectPageMenuItem.vue";

const props = defineProps({
  projectId: Number
})

const useProjectPage = useProjectPageStore()

const menuOptions: MenuOption[] = [
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: RouteName.modelManager,
                query: {projectId: props.projectId}
              },
              draggable: false
            },
            h(ProjectPageMenuItem, {title: '模型'}, {
              icon: h('div', {class: 'i-tabler:cube-3d-sphere'})
            })
        ),
    key: RouteName.modelManager,
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: RouteName.typeManager,
                query: {projectId: props.projectId}
              },
              draggable: false
            },
            h(ProjectPageMenuItem, {title: '类型'}, {
              icon: h('div', {class: 'i-tabler:components'})
            })
        ),
    key: RouteName.typeManager,
  }, {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: RouteName.databaseManager,
                query: {projectId: props.projectId}
              },
              draggable: false
            },
            h(ProjectPageMenuItem, {title: '数据库'}, {
              icon: h('div', {class: 'i-tabler:database-cog'})
            })
        ),
    key: RouteName.databaseManager,
  },
]

</script>

<style scoped lang="less">
#side-menu:deep(.n-menu-item) {
  height: 50px;
}

#side-menu:deep(.n-menu-item-content-header) {
  width: 48px;
  position: absolute;
  left: -14px;
  top: 4px;
}
</style>
