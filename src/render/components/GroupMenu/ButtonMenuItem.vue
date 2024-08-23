<template>
	<n-button
		id="menu-button"
		quaternary
		class="w-full p-0"
		@click="handleMenuClick(menuOption)"
		:style="{backgroundColor: selectedKey === menuOption.key ? useThemeVars().value.buttonColor2Hover : '',
		paddingLeft: menuIndex * 12 + 'px' }"
		@mouseover="handleMouseOver"
		@mouseleave="handleMouseLeave"
	>
		<template #default>
			<n-flex class="w-full pr-1" :size="0" align="center" justify="space-between" :wrap="false">
				<n-flex
					ref="itemContextRef"
					class="item-content"
					align="center"
					:size="0"
					:style="{width: 'calc(100% - ' + (menuIndex * 12) + 'px)'}"
					:wrap="false"
				>
					<component v-if="!isGroup && !menuOption.hiddenExpandIcon"
										 class="min-w-12px min-h-12px"
										 :is="renderExpandIcon"/>
					<component v-if="renderPrefix"
										 class="min-w-18px min-h-18px"
										 :is="renderPrefix({ option: menuOption, checked: false, selected: selectedKey === menuOption.key })"/>
					<n-flex class="text-left whitespace-nowrap overflow-hidden text-ellipsis h-18px"  :wrap="false">
						<component v-if="renderLabel"
											 :is="renderLabel({ option: menuOption, checked: false, selected: selectedKey === menuOption.key })"/>
						<n-text v-else class="" depth="2">
							{{ menuOption.label }}
						</n-text>
					</n-flex>
				</n-flex>
				<n-flex ref="itemSuffixRef" class="item-suffix" align="center" :wrap="false">
          <span
						v-if="renderSuffix"
						class="suffix-content"
					>
            <component
							:is="renderSuffix({ option: menuOption, checked: false, selected: selectedKey === menuOption.key })"/>
          </span>
				</n-flex>
			</n-flex>
		</template>
	</n-button>
</template>

<script setup lang="ts">
import {NFlex, useThemeVars} from "naive-ui";
import {computed, h, PropType, ref, VNodeChild} from "vue";
import {GroupMenuOption} from "@render/components/GroupMenu/types";

const props = defineProps({
	menuOption: Object as PropType<GroupMenuOption>,
	selectedKey: String,
	expandedKeys: Array as PropType<string[]>,
	handleMenuClick: Function as PropType<(option: GroupMenuOption) => void>,
	menuIndex: Number,
	renderPrefix: {
		type: Function as PropType<({option, checked, selected}: {
			option: GroupMenuOption,
			checked: boolean,
			selected: boolean
		}) => VNodeChild>,
		default: undefined,
	},
	renderLabel: {
		type: Function as PropType<({option, checked, selected}: {
			option: GroupMenuOption,
			checked: boolean,
			selected: boolean
		}) => VNodeChild>,
		default: undefined,
	},
	// 是否显示后缀
	suffixAlwaysShow: {
		type: Boolean,
		default: false,
	},
	renderSuffix: {
		type: Function as PropType<({option, checked, selected}: {
			option: GroupMenuOption,
			checked: boolean,
			selected: boolean
		}) => VNodeChild>,
		default: undefined,
	},
});

const itemContextRef = ref()
const itemSuffixRef = ref()

const isGroup = computed(() => {
	return props.menuOption.menuType === 'group';
});
const isExpanded = computed(() => {
	if (props.expandedKeys) {
		return props.expandedKeys.includes(props.menuOption.key);
	}
	return false
});

/**
 * 渲染展开的图标
 **/
const renderExpandIcon = () => {
	if (props.menuOption.children) {
		if (isExpanded.value) {
			return h('div', {class: 'i-tabler:chevron-down w-3'})
		} else {
			return h('div', {class: 'i-tabler:chevron-right w-3'})
		}
	} else {
		return null;
	}
}

const showSuffix = ref(false);

const handleMouseOver = () => {
	if (!props.suffixAlwaysShow) {
		showSuffix.value = true;
	}
}

const handleMouseLeave = () => {
	if (!props.suffixAlwaysShow) {
		showSuffix.value = false;
	}
}

</script>

<style scoped lang="less">
#menu-button:deep(.n-button__content) {
	width: 100%;
}

#menu-button .suffix-content {
	display: none; /* 默认隐藏子按钮 */
}

#menu-button:hover .suffix-content {
	display: block; /* 默认隐藏子按钮 */
}

</style>
