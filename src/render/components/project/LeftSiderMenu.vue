<template>
	<n-menu
		v-model:value="useProjectPage.activeSideMenuItemKey"
		id="side-menu"
		class="w-20 pt-2"
		:options="menuOptions"
		draggable="false"
		@update:value="handleUpdate"
	/>
</template>

<script setup lang="ts">
import type {MenuOption} from 'naive-ui'
import {h, onMounted} from "vue";
import {RouterLink} from "vue-router";
import {
	AppsList24Regular
} from "@vicons/fluent";
import {RouteName} from "@common/constants/app/RouteName";
import {useTopMenuStore} from "@render/stores/useTopMenu";
import {useProjectPageStore} from "@render/stores/useProjectPage";
import ProjectPageMenuItem from "@render/components/project/ProjectPageMenuItem.vue";

const useTopMenu = useTopMenuStore()
const useProjectPage = useProjectPageStore()

const menuOptions: MenuOption[] = [
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						name: RouteName.modelManager,
						query: {projectId: useTopMenu.activeItemKey}
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
						query: {projectId: useTopMenu.activeItemKey}
					},
					draggable: false
				},
				h(ProjectPageMenuItem, {title: '类型'}, {
					icon: h('div', {class: 'i-tabler:components'})
				})
			),
		key: RouteName.typeManager,
	},
]

const handleUpdate = (value: string) => {
	// 当在某个项目页面下点击左侧菜单时，更新激活的菜单项
	if (useProjectPage.projectStateMap.has(useTopMenu.activeItemKey)) {
		useProjectPage.projectStateMap.get(useTopMenu.activeItemKey).activeSideMenuItemKey = value
	} else {
		useProjectPage.projectStateMap.set(useTopMenu.activeItemKey, {
			activeSideMenuItemKey: value
		})
	}
}

onMounted(() => {
	// 从其他页面，比如首页加载进来时，判断当前项目是否已有缓存的激活菜单项，存在则直接跳转，不存在则新增，跳转到默认菜单项
	if (useProjectPage.projectStateMap.has(useTopMenu.activeItemKey)) {
		useProjectPage.activeSideMenuItemKey = useProjectPage.projectStateMap.get(useTopMenu.activeItemKey).activeSideMenuItemKey
	} else {
		useProjectPage.activeSideMenuItemKey = RouteName.modelManager
	}
})
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
