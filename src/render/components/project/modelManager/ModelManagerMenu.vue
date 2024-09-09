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
			<n-flex :wrap="false" class="w-full mb-2">
				<n-input
					:size="'small'"
					placeholder=""
					v-model:value="searchValue"
					clearable
				>
					<template #prefix>
						<div class="i-tabler:search"/>
					</template>
				</n-input>
				<n-button :size="'small'" text @click="handleMenuLocation">
					<template #icon>
						<RenderIcon className="i-material-symbols:my-location-outline-rounded"/>
					</template>
				</n-button>
			</n-flex>

			<PrettyTreeMenu
				ref="prettyTreeMenuRef"
				:tree-data="useModelManager.menuOptions"
				:pattern="searchValue"
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
import {computed, h, ref, VNodeChild} from "vue";
import {NButton, NFlex, NText, useThemeVars} from "naive-ui"
import {useModelManagerStore} from "@render/stores/useModelManager";
import PrettyTreeMenu from "@render/components/PrettyTreeMenu/PrettyTreeMenu.vue";
import {
	PrettyMenuUtils,
	RenderMenuNodeInfo,
	UpdateExpandedKeysInfo,
	UpdateSelectedKeysInfo
} from "@render/components/PrettyTreeMenu";
import RenderIcon from "@render/components/icon/RenderIcon.vue";

const props = defineProps({
	projectId: Number
})

const useModelManager = useModelManagerStore()

const prettyTreeMenuRef = ref(null);

const primaryColor = computed(() => useThemeVars().value.primaryColor)

const searchValue = ref()

const handleRenderLabel = (info: RenderMenuNodeInfo): VNodeChild => {
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

const handleRenderPrefix = (info: RenderMenuNodeInfo): VNodeChild => {
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

const handleUpdateSelectedKeys = ({keys, option, meta}: UpdateSelectedKeysInfo) => {
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

const handleUpdateExpandedKey = ({keys}: UpdateExpandedKeysInfo) => {
	if (!keys.some(key => key === 'datatableRoot')) {
		keys.push('datatableRoot')
	}
	useModelManager.updateGroupMenuExpandedKeys(props.projectId, keys)
}

const handleMenuLocation = () => {
	prettyTreeMenuRef.value?.scrollToSelected()
}
</script>

<style scoped lang="less">
</style>
