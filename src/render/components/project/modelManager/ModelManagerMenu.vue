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
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import GroupMenu from "@render/components/GroupMenu/GroupMenu.vue";
import {GroupMenuOption} from "@render/components/GroupMenu/types";

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
										icon: 'i-tabler:table',
										children: [
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
											}]
									}]
							}]
					}]
			}
		]
	},
	{
		menuType: 'group',
		label: '树',
		key: 'tree',
		icon: 'i-tabler:tree',
		hasExtraButton: true
	}
])


</script>

<style scoped lang="less">

</style>
