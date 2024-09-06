<template>
	<div>
		<div class="absolute top-0 left-0 right-0 h-10">
			<n-flex justify="space-between" align="center" class="pr-4">
				<n-text class="whitespace-nowrap overflow-hidden text-ellipsis text-base" depth="2">模型管理</n-text>
				<n-button :size="'small'" text @click="useModelManager.updateSplitSize(projectId,'0px')">
					<template #icon>
						<div class="i-lets-icons:expand-left-stop"/>
					</template>
				</n-button>
			</n-flex>
		</div>
		<div class="absolute top-10 left-0 right-4 bottom-0">
			<PrettyTreeMenu
				:tree-data="useModelManager.menuOptions"
				:render-label="handleRenderLabel"
				:render-prefix="handleRenderPrefix"
				:selected-keys="useModelManager.stateMap.get(projectId).groupMenuSelectedKeys"
				:expanded-keys="useModelManager.stateMap.get(projectId).groupMenuExpandedKeys"
				@update:selected-keys="handleUpdateSelectedKeys"
				@update:expanded-keys="handleUpdateExpandedKey"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {computed, h, onMounted, VNodeChild} from "vue";
import {GroupMenuOption} from "@render/components/GroupMenu/types";
import {NButton, NFlex, NText, useThemeVars} from "naive-ui"
import {useModelManagerStore} from "@render/stores/useModelManager";
import PrettyTreeMenu from "@render/components/PrettyTreeMenu/PrettyTreeMenu.vue";
import {PrettyMenuUtils, PrettyTreeMenuOption} from "@render/components/PrettyTreeMenu";

const props = defineProps({
	projectId: Number
})

const useModelManager = useModelManagerStore()

const primaryColor = computed(() => useThemeVars().value.primaryColor)

const handleRenderLabel = (info: { option: PrettyTreeMenuOption, checked: boolean, selected: boolean }): VNodeChild => {
	if (info.option?.needLabelRightExpandIcon) {
		const expandedKeys = useModelManager.stateMap.get(props.projectId).groupMenuExpandedKeys
		const isExpanded = expandedKeys.includes(info.option.key as string)
		const className = 'i-material-symbols:arrow-right-rounded ' + (isExpanded ? 'rotate-90' : '')

		return h(NFlex, {size: 4, wrap: false, align: 'center'}, () => [
			h(NText, null, info.option.label),
			h('div', {class: className})
		])
	}

	return info.option.label
}

const handleRenderPrefix = (info: {
	option: PrettyTreeMenuOption,
	checked: boolean,
	selected: boolean
}): VNodeChild => {
	let actionColor = info.selected ? primaryColor.value : ''
	// 清除actionColor里的空格
	actionColor = actionColor.replace(/\s+/g, '')

	const key = info.option.key as string
	if (key === 'overview') {
		return PrettyMenuUtils.renderPrettyMenuIcon(`i-tabler:layout-dashboard`, actionColor)
	} else if (key === 'dataTableTree') {
		return PrettyMenuUtils.renderPrettyMenuIcon(`i-tabler:table-options `, actionColor)
	} else if (key === 'datatableRoot') {
		return PrettyMenuUtils.renderPrettyMenuIcon(`i-tabler:folder `, actionColor)
	} else if (key.startsWith('datatableFolder-')) {
		return PrettyMenuUtils.renderPrettyMenuIcon(`i-tabler:folder `, actionColor)
	} else {
		return PrettyMenuUtils.renderPrettyMenuIcon(`i-tabler:table `, actionColor)
	}
}

const renderMenuIcon = (className: string) => {
	return h('div', {class: className + " text-lg mr-1"})
}

const handleUpdateSelectedKeys = (
	keys: Array<string | number>,
	option: Array<PrettyTreeMenuOption | null>,
	meta: { node: PrettyTreeMenuOption | null, action: 'select' | 'unselect' }
) => {
	const key = keys[0] as string
	const currentOption = option[0]

	if (key === 'overview') {
		useModelManager.addOverviewTabPanel(props.projectId, true)
	} else if (key === 'datatableTree' || key === 'datatableRoot' || key.startsWith('datatableFolder-')) {
		return;
	} else if (key.startsWith('datatable-')) {
		// 打开数据表
		useModelManager.addTabPanel(props.projectId, {
			panelOptions: {
				key: key,
				label: currentOption.label,
				type: 'datatable'
			},
			modelOptions: {
				id: key.replace('datatable-', ''),
			}
		}, true)
	}
}

const handleUpdateExpandedKey = (keys: string[], options: GroupMenuOption[]) => {
	if (!keys.some(key => key === 'datatableRoot')) {
		keys.push('datatableRoot')
	}
	useModelManager.updateGroupMenuExpandedKeys(props.projectId, keys)
}

onMounted(() => {
})

</script>

<style scoped lang="less">
</style>
