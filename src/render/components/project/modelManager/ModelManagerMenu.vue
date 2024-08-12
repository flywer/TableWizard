<template>
	<div class="relative top-2 left-2 right-4">
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
				:selected-key="activeKey"
				:expanded-keys="expandedKeys"
				@update:selected-key="handleUpdateSelectedKey"
				@update:expanded-keys="handleUpdateExpandedKey"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import GroupMenu from "@render/components/GroupMenu/GroupMenu.vue";
import {GroupMenuOption} from "@render/components/GroupMenu/types";

const activeKey = ref<string>(null);
const expandedKeys = ref<string[]>(null);

const menuOptions = reactive<GroupMenuOption[]>([
	{
		menuType: 'group',
		label: '项目概览',
		key: 'overview',
		icon: 'i-tabler:layout-dashboard',
	},
	{
		menuType: 'group',
		label: '数据表',
		key: 'dataTable',
		icon: 'i-tabler:table',
		hasExtraButton: true,
		children: [
			{
				menuType: 'tree',
				label: '数据表1',
				key: 'dataTable1',
				icon: 'i-tabler:table',
				children: [
					{
						menuType: 'tree',
						label: '数据表1-1',
						key: 'dataTable1-1',
						icon: 'i-tabler:table',
						children: [
							{
								menuType: 'tree',
								label: '数据表1-1-1',
								key: 'dataTable1-1-1',
								icon: 'i-tabler:table',
								children: [
									{
										menuType: 'tree',
										label: '数据表1-1-1-1',
										key: 'dataTable1-1-1-1',
										icon: 'i-tabler:table'
									}]
							}]
					},
					{
						menuType: 'tree',
						label: '数据表1-1-1-1-1',
						key: 'dataTable1-1-1-1-1',
						icon: 'i-tabler:table',
						children: [
							{
								menuType: 'tree',
								label: '数据表1-1-1-1-1-1',
								key: 'dataTable1-1-1-1-1-1',
								icon: 'i-tabler:table',
								children: [
									{
										menuType: 'tree',
										label: '数据表1-1-1-1-1-1-1',
										key: 'dataTable1-1-1-1-1-1-1',
										icon: 'i-tabler:table',
									}
								]
							}]
					}
				]
			}
		]
	},
	{
		menuType: 'tree',
		label: '树',
		key: 'tree',
		icon: 'i-tabler:tree',
		hasExtraButton: true
	}
])

const handleUpdateSelectedKey = (key: string, option: GroupMenuOption) => {
	activeKey.value = key
}

const handleUpdateExpandedKey = (keys: string[], options: GroupMenuOption[]) => {
	expandedKeys.value = keys
}
</script>

<style scoped lang="less">

</style>
