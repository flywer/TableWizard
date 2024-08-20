<template>
	<div>
		<div class="absolute top-0 left-0 right-0 h-10">
			<n-flex justify="space-between" align="center">
				<n-h4
					class="whitespace-nowrap overflow-hidden text-ellipsis"
				>
					<n-text depth="2">模型管理</n-text>
				</n-h4>
			</n-flex>
		</div>
		<div class="absolute top-10 left-0 right-4 bottom-0">
			<GroupMenu
				:menu-options="useModelManager.menuOption"
				:selected-key="useModelManager.stateMap.get(projectId).groupMenuSelectedKey"
				:expanded-keys="useModelManager.stateMap.get(projectId).groupMenuExpandedKeys"
				:render-prefix="customPrefix"
				:render-label="renderLabel"
				:render-suffix="customSuffix"
				@update:selected-key="handleUpdateSelectedKey"
				@update:expanded-keys="handleUpdateExpandedKey"
			/>
		</div>
		<n-dropdown
			trigger="manual"
			placement="bottom-start"
			:size="'small'"
			:show="dropdownParam.show"
			:options="dropdownParam.options"
			:x="dropdownParam.x"
			:y="dropdownParam.y"
			@select="handleDropdownSelect"
			@clickoutside="handleClickoutside"
			@mouseleave="handleClickoutside"
		/>
	</div>
</template>

<script setup lang="ts">
import {h, onMounted, reactive} from "vue";
import GroupMenu from "@render/components/GroupMenu/GroupMenu.vue";
import {GroupMenuOption} from "@render/components/GroupMenu/types";
import {NButton, NFlex, NText, useThemeVars} from "naive-ui"
import {useModelManagerStore} from "@render/stores/useModelManager";
import {ModelApi} from "@render/api/ModelApi";

const props = defineProps({
	projectId: Number
})

const useModelManager = useModelManagerStore()

const dropdownParam = reactive({
	show: false,
	options: [],
	menuOption: null,
	x: null,
	y: null
})

const handleClickoutside = () => {
	dropdownParam.show = false
}

const renderMenuIcon = (className: string) => {
	return h('div', {class: className + " text-lg mr-1"})
}

const handleUpdateSelectedKey = (key: string, option: GroupMenuOption) => {
	if (key === 'overview') {

		useModelManager.addOverviewTabPanel(props.projectId, true)
	} else if (key === 'datatable') {
		return;
	} else if (option.type === 'datatable') {
		// 打开数据表
		useModelManager.addTabPanel(props.projectId, {
			panelOptions: {
				key: key,
				label: option.label,
				type: 'datatable'
			},
			modelOptions: {
				id: key,
			}
		}, true)
	}
	// update selected key
	// useProjectPage.projectStateMap.get(props.projectId).groupMenuSelectedKey = key
}

const handleUpdateExpandedKey = (keys: string[], options: GroupMenuOption[]) => {
	useModelManager.updateGroupMenuExpandedKeys(props.projectId, keys)
}

const customPrefix = ({option, checked, selected}: {
	option: GroupMenuOption,
	checked: boolean,
	selected: boolean
}) => {
	let actionColor = selected ? `text-[${useThemeVars().value.primaryColor}]` : ''
	// 清除actionColor里的空格
	actionColor = actionColor.replace(/\s+/g, '')

	if (option.key === 'overview') {
		return renderMenuIcon(`i-tabler:layout-dashboard ${actionColor}`)
	} else if (option.key === 'dataTable') {
		return renderMenuIcon(`i-tabler:table-options ${actionColor}`)
	} else if (option.key.endsWith('-root')) {
		return renderMenuIcon(`i-tabler:folder ${actionColor}`)
	} else if (option.type === 'folder') {
		return renderMenuIcon(`i-tabler:folder ${actionColor}`)
	} else {
		return renderMenuIcon(`i-tabler:table ${actionColor}`)
	}
}

const renderLabel = ({option, checked, selected}: {
	option: GroupMenuOption,
	checked: boolean,
	selected: boolean
}) => {
	if (option.key === 'overview') {
		return h(NText, null, () => '项目概览')
	} else if (option.key === 'dataTable') {
		const expandedKeys = useModelManager.stateMap.get(props.projectId).groupMenuExpandedKeys
		const isExpanded = expandedKeys.includes(option.key)

		let className = ''
		if (useModelManager.hasChildrenMenu(option.key, useModelManager.menuOption)) {
			className = 'i-material-symbols:arrow-right-rounded ' + (isExpanded ? 'rotate-90' : '')
		} else {
			className = 'i-material-symbols:arrow-right-rounded ' + (isExpanded ? 'rotate-90' : '')
		}

		return h(NFlex, {size: 4}, () => [
			h(NText, null, '数据表'),
			h('div', {class: className})
		])
	}

	return h(NText, null, () => option.label)
}

const datatableGroupDropdownOptions = [
	{
		label: '新建数据表',
		key: 'createDatatable',
		icon: () => h('div', {class: 'i-tabler:table-plus'})
	},
	{
		label: '新建文件夹',
		key: 'createFolder',
		icon: () => h('div', {class: 'i-tabler:folder-plus'})
	}
]

const dropdownOptionsMap = {
	dataTable: datatableGroupDropdownOptions
}

const getDropdownOptionsMap = (option: GroupMenuOption) => {

	return
}

const customSuffix = ({option, checked, selected}: {
	option: GroupMenuOption,
	checked: boolean,
	selected: boolean
}) => {
	if (option.key !== 'overview') {
		return h(NButton,
			{
				size: 'tiny',
				class: 'hover:display-none',
				quaternary: true,
				onClick: (event) => {
					event.stopPropagation(); // 阻止事件冒泡到父元素

					dropdownParam.x = event.clientX;
					dropdownParam.y = event.clientY; // 将 y 设置为按钮下边缘

					dropdownParam.options = dropdownOptionsMap[option.key]
					dropdownParam.menuOption = option
					dropdownParam.show = true
				}
			},
			{
				icon: () => h('div', {class: 'i-material-symbols:more-horiz'})
			})
	} else {
		return null
	}
}

/**
 * 这里控制所有的下拉菜单的点击事件
 **/
const handleDropdownSelect = (key: string) => {
	switch (key) {
		case 'createDatatable':
			let parentId = null
			if (dropdownParam.menuOption.key !== 'dataTable') {
				parentId = dropdownParam.menuOption.key
			}
			useModelManager.addNewDataTableTabPanel(props.projectId, parentId, true)
			break
		case 'createFolder':
			// handleCreateFolder()
			break
	}

	dropdownParam.show = false
}

onMounted(() => {
/*	ModelApi.getDataTableMenu(props.projectId).then((res) => {
		console.log(res)
	})*/
})

</script>

<style scoped lang="less">

</style>
