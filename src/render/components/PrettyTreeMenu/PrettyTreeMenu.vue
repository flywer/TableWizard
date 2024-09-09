<template>
	<n-tree
		id="pretty-tree-menu"
		ref="treeMenuRef"
		block-line
		:data="treeData"
		:pattern="pattern"
		:show-irrelevant-nodes="false"
		:cancelable="false"
		:multiple="false"
		:render-label="renderLabel as any"
		:render-prefix="renderPrefix as any"
		:render-switcher-icon="renderSwitcherIcon"
		:node-props="nodeProps"
		:override-default-node-click-behavior="clickOverride"
		:selected-keys="selectedKeys"
		:expanded-keys="expandedKeys"
		@update:selected-keys="handleUpdateSelectedKeys as any"
		@update:expanded-keys="handleUpdateExpandedKeys"
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
import {h, HTMLAttributes, onMounted, PropType, reactive, ref, render, VNodeChild} from "vue";
import {useMutationObserver} from "@vueuse/core";
import {
	PrettyMenuUtils,
	PrettyTreeMenuOption,
	RenderMenuNodeInfo,
	UpdateExpandedKeysInfo,
	UpdateSelectedKeysInfo
} from "@render/components/PrettyTreeMenu/index";
import {isEmpty} from "lodash";

type ClickOverrideType = 'toggleExpand' | 'toggleSelect' | 'toggleCheck' | 'default' | 'none'

const props = defineProps({
	treeData: Array as PropType<PrettyTreeMenuOption[]>,
	pattern: String,
	selectedKeys: Array as PropType<string[]>,
	expandedKeys: Array as PropType<string[]>,
	renderLabel: Function as PropType<(info: RenderMenuNodeInfo) => VNodeChild>,
	renderPrefix: Function as PropType<(info: RenderMenuNodeInfo) => VNodeChild>,
})

const emit = defineEmits(['update:selected-keys', 'update:expanded-keys'])

interface ScrollTo {
	(x: number, y: number): void;

	(options: { left?: number; top?: number; debounce?: boolean }): void;

	(options: { index: number; debounce?: boolean }): void;

	(options: { key: string | number; debounce?: boolean }): void;

	(options: { position: 'top' | 'bottom'; debounce?: boolean }): void;
}

defineExpose({
	scrollTo: (info: ScrollTo) => treeMenuRef?.value.scrollTo(info),
	scrollToSelected: () => {
		const selectedNode = document.querySelector('.n-tree-node-selected');
		if (selectedNode) {
			selectedNode.scrollIntoView({block: 'center', inline: 'center'});
		}
	}
})

const treeMenuRef = ref(null)

const dropdownParam = reactive({
	show: false,
	options: [],
	menuOption: null,
	x: null,
	y: null
})

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
	const info: UpdateSelectedKeysInfo = {
		keys: keys as string[],
		option: option as PrettyTreeMenuOption[],
		meta
	}
	emit('update:selected-keys', info)
}

const handleUpdateExpandedKeys = (keys: string[], options: TreeOption[]) => {
	const info: UpdateExpandedKeysInfo = {
		keys,
		options
	}
	emit('update:expanded-keys', info)
}

const handleClickoutside = () => {
	dropdownParam.show = false
}

const handleDropdownSelect = (key: string) => {
	const menuOption = dropdownParam.menuOption as PrettyTreeMenuOption;
	menuOption?.onDropdownSelect?.(key);
	dropdownParam.show = false;
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
	treeMenuRef.value.scrollTo({top: 0})
});

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
	align-self: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 12px;
}

#pretty-tree-menu:deep(.n-tree-node-wrapper) {
	padding: 1px;
}

</style>
