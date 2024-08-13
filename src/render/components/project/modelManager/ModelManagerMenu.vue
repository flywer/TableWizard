<template>
	<div>
		<div class="absolute top-0 left-0 right-0 h-10">
			<n-flex justify="space-between" align="center">
				<n-h4 class="whitespace-nowrap overflow-hidden text-ellipsis">
					<n-text depth="2">模型管理</n-text>
				</n-h4>
			</n-flex>
		</div>
		<div class="absolute top-10 left-0 right-4 bottom-0">
			<GroupMenu
				:menu-options="menuOptions"
				:selected-key="useProjectPage.projectStateMap.get(projectId).groupMenuSelectedKey"
				:expanded-keys="useProjectPage.projectStateMap.get(projectId).groupMenuExpandedKeys"
				@update:selected-key="handleUpdateSelectedKey"
				@update:expanded-keys="handleUpdateExpandedKey"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import GroupMenu from "@render/components/GroupMenu/GroupMenu.vue";
import {GroupMenuOption} from "@render/components/GroupMenu/types";
import {useProjectPageStore} from "@render/stores/useProjectPage";

const props = defineProps({
	projectId: Number
})

const useProjectPage = useProjectPageStore()

const menuOptions = reactive<GroupMenuOption[]>([
	{
		menuType: 'group',
		label: '项目概览',
		type: 'overview',
		key: 'overview',
		icon: 'i-tabler:layout-dashboard',
	},
	{
		menuType: 'group',
		label: '数据表',
		type: 'folder',
		key: 'dataTable',
		icon: 'i-tabler:table',
		hasExtraButton: true,
		children: [
			{
				menuType: 'tree',
				type: 'datatable',
				label: '数据表1',
				key: 'dataTable1',
				icon: 'i-tabler:table'
			}
		]
	},
])

const handleUpdateSelectedKey = (key: string, option: GroupMenuOption) => {

	if (option.type === 'overview') {
		// open overview
		useProjectPage.activeModelTabPanel(props.projectId, {
			key: key,
			tag: '总览',
			label: '项目总览',
			type: 'overview'
		})
	} else if (option.type === 'datatable') {
		// open dataTable
		useProjectPage.activeModelTabPanel(props.projectId, {
			key: key,
			tag: '数据表',
			label: '数据表',
			type: 'datatable'
		})
	}
	// update selected key
	useProjectPage.projectStateMap.get(props.projectId).groupMenuSelectedKey = key
}

const handleUpdateExpandedKey = (keys: string[], options: GroupMenuOption[]) => {
	useProjectPage.projectStateMap.get(props.projectId).groupMenuExpandedKeys = keys
}

</script>

<style scoped lang="less">

</style>
