<template>
	<n-button
		quaternary
		tag="span"
		class="justify-left pl-1 w-full"
		@click="handleMenuClick(group)"
		:style="{backgroundColor: selectedKey === group.key ? useThemeVars().value.buttonColor2Hover : ''}"
	>
		<template #icon>
			<n-text depth="2">
				<component :is="renderItemIcon()"/>
			</n-text>
		</template>
		<n-flex :wrap="false" class="whitespace-nowrap overflow-hidden text-ellipsis" :size="0">
			<component :is="renderItemPrefixIcon()" class="shrink-0"/>
			<n-text depth="2">{{ group.label }}</n-text>
		</n-flex>
		<n-text depth="3">
			<component :is="renderItemSuffixIcon()" :class="isExpanded ? 'rotate-90':''"/>
		</n-text>

		<div v-if="group.hasExtraButton" class="absolute top-1.5 right-1.5">
			<n-button quaternary size="tiny">
				<template #icon>
					<div class="i-material-symbols:search-rounded"/>
				</template>
			</n-button>
		</div>
	</n-button>
</template>

<script setup lang="ts">
import {useThemeVars} from "naive-ui";
import {computed, h, PropType, VNodeChild} from "vue";
import {GroupMenuOption} from "@render/components/GroupMenu/types";

const props = defineProps({
	group: Object as PropType<GroupMenuOption>,
	selectedKey: String,
	expandedKeys: Array as PropType<string[]>,
	handleMenuClick: Function as PropType<(option: GroupMenuOption) => void>,
	renderPrefix: {
		type: Function as PropType<() => VNodeChild>,
		default: undefined
	}
});

const isExpanded = computed(() => {
	if (props.expandedKeys) {
		return  props.expandedKeys.includes(props.group.key);
	}
	return false
});

/**
 * 渲染菜单的图标
 */
const renderItemIcon = () => {
	if (props.group.menuType === 'group') {
		return h('div', {class: props.group.icon})
	} else {
		let expandedIconClass: string
		if (props.group.children) {
			if (isExpanded.value) {
				expandedIconClass = 'i-tabler:chevron-down w-3'
			} else {
				expandedIconClass = 'i-tabler:chevron-right w-3'
			}
		} else {
			expandedIconClass = ''
		}
		return h('div', {class: expandedIconClass})
	}
}

const renderItemPrefixIcon = () => {
	if (props.group.menuType === 'group') {
		return h('div', null)
	} else {
		let folderIconClass: string
		if (props.group.children) {
			if (isExpanded.value) {
				folderIconClass = 'i-material-symbols:folder-open-outline-rounded'
			} else {
				folderIconClass = 'i-material-symbols:folder-outline-rounded'
			}
		} else {
			folderIconClass = ''
		}
		return h('div', {class: folderIconClass + ' w-4 h-4 mr-1'})
	}
}

const renderItemSuffixIcon = () => {
	if (props.group.menuType === 'group' && props.group.children) {
		return h('div', {class: 'i-material-symbols:arrow-right-rounded w-4 h-4'})
	} else {
		return h('div', null)
	}
}

</script>

<style scoped lang="less">
</style>
