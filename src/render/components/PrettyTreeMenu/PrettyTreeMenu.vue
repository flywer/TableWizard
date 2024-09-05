<template>
	<n-tree
		id="pretty-tree-menu"
		block-line
		:data="treeData"
		:cancelable="false"
		:multiple="false"
		:render-label="renderLabel"
		:render-prefix="renderPrefix"
		:render-switcher-icon="renderSwitcherIcon"
		:node-props="nodeProps"
		:override-default-node-click-behavior="clickOverride"
		:selected-keys="selectedKeys"
		:expanded-keys="expandedKeys"
		@update:selected-keys="handleUpdateSelectedKeys"
		@update:expanded-keys="$emit('update:expanded-keys', $event)"
	/>

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
</template>

<script setup lang="ts">
import {NButton, TreeOption} from "naive-ui";
import {h, HTMLAttributes, onMounted, PropType, reactive, render, VNodeChild} from "vue";
import {useMutationObserver} from "@vueuse/core";
import {PrettyMenuUtils, PrettyTreeMenuOption} from "@render/components/PrettyTreeMenu/index";
import {isEmpty} from "lodash";

type ClickOverrideType = 'toggleExpand' | 'toggleSelect' | 'toggleCheck' | 'default' | 'none'

const props = defineProps({
	treeData: Array as PropType<PrettyTreeMenuOption[]>,
	selectedKeys: Array as PropType<string[]>,
	expandedKeys: Array as PropType<string[]>,
	renderLabel: Function as PropType<(info: {
		option: PrettyTreeMenuOption,
		checked: boolean,
		selected: boolean
	}) => VNodeChild>,
	renderPrefix: Function as PropType<(info: {
		option: PrettyTreeMenuOption,
		checked: boolean,
		selected: boolean
	}) => VNodeChild>,
})

const emit = defineEmits(['update:selected-keys', 'update:expanded-keys'])

const renderSwitcherIcon = () => {
	return h('div', {class: 'i-tabler:chevron-right w-3'})
}

// 自定义节点属性
const nodeProps = ({option}: { option: PrettyTreeMenuOption }): HTMLAttributes => {
	return {
		class: `pretty-tree-node-${option.key}`,
		style: {
			height: '34px',
			lineHeight: '34px',
			fontSize: '14px',
			borderRadius: '6px',
			alignItems: 'center',
		},
		onMouseenter: (e: MouseEvent) => {
			const nodeElement = e.currentTarget as HTMLElement;
			let button = nodeElement.querySelector('.dropdown-btn') as HTMLElement;
			if (!button) {
				if (option.dropdownOptions && !isEmpty(option.dropdownOptions)) {
					renderDropdownButton(nodeElement, option);
				}
			}
			button = nodeElement.querySelector('.dropdown-btn') as HTMLElement;
			button?.classList.add('dropdown-btn-visible');
		},
		onMouseleave: (e: MouseEvent) => {
			const nodeElement = e.currentTarget as HTMLElement;
			const button = nodeElement.querySelector('.dropdown-btn');
			if (button) {
				button.classList.remove('dropdown-btn-visible');
			}
		}
	}
}

const renderDropdownButton = (container: HTMLElement, option: PrettyTreeMenuOption) => {
	const vNode = h(NButton,
		{
			size: 'tiny',
			class: 'dropdown-btn',
			quaternary: true,
			onClick: (event) => {
				event.stopPropagation(); // 阻止事件冒泡到父元素

				dropdownParam.x = event.clientX;
				dropdownParam.y = event.clientY; // 将 y 设置为按钮下边缘

				dropdownParam.options = option.dropdownOptions
				dropdownParam.menuOption = option
				dropdownParam.show = true
			}
		},
		{
			icon: () => h('div', {class: 'i-material-symbols:more-horiz'})
		})
	render(vNode, container);
}

// 利用 VueUse 监听 DOM 变化并动态修改样式
onMounted(() => {
	const treeMenu = document.getElementById('pretty-tree-menu');
	if (treeMenu) {
		hideExpandIcon(treeMenu)
		useMutationObserver(treeMenu, mutations => {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					hideExpandIcon(treeMenu)
				}
			}
		}, {childList: true, subtree: true});
	}
});

const hideExpandIcon = (treeMenu: HTMLElement) => {
	if (treeMenu) {
		const nodes = treeMenu.querySelectorAll('.n-tree-node-switcher');
		nodes.forEach(node => {
			const parentNode = node.closest('.n-tree-node');
			if (parentNode) {
				const treeNodeKey = parentNode.className.split(' ').filter(className => className.startsWith('pretty-tree-node-'))[0].replace('pretty-tree-node-', '');
				const treeNode = PrettyMenuUtils.findNodeByKey(treeNodeKey, props.treeData);
				if (treeNode && treeNode?.hideExpandIcon || !PrettyMenuUtils.findNodeHasChildren(treeNodeKey, props.treeData)) {
					(node as HTMLElement).style.display = 'none';
				} else {
					(node as HTMLElement).style.display = '';
				}
			}
		});
	}
}

// 节点点击事件覆写
const clickOverride = (info: { option: PrettyTreeMenuOption }): ClickOverrideType => {
	if (info.option.children) {
		return 'toggleExpand'
	}

	return 'default';
}

const handleUpdateSelectedKeys = (keys: Array<string | number>, option: Array<TreeOption | null>, meta: {
	node: TreeOption | null,
	action: 'select' | 'unselect'
}) => {
	emit('update:selected-keys', keys as string[], option as PrettyTreeMenuOption[], meta)
}

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

const handleDropdownSelect = (key: string) => {
	const menuOption = dropdownParam.menuOption as PrettyTreeMenuOption;
	menuOption?.onDropdownSelect?.(key);
	dropdownParam.show = false;
}

</script>

<style scoped lang="less">
#pretty-tree-menu :deep(.n-tree-node-switcher) {
	height: 34px;
}

#pretty-tree-menu :deep(.n-tree-node-indent) {
	width: 12px;
}

#pretty-tree-menu:deep(.dropdown-btn) {
	display: none;
	margin-right: 4px;
	transition: all 0.3s ease;
}

#pretty-tree-menu:deep(.dropdown-btn-visible) {
	display: inline-flex;
}

#pretty-tree-menu:deep(.n-tree-node-content__prefix) {
	margin-right: 0;
}

#pretty-tree-menu:deep(.n-tree-node-content__text) {
	line-height: 20px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

#pretty-tree-menu:deep(.n-tree-node-wrapper) {
	padding: 1px;
}

</style>
