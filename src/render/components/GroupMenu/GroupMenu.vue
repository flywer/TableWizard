<template>
	<n-flex class="w-full" justify="start" vertical :size="0">
		<div class="w-full" v-for="menuOption in menuOptions" :key="menuOption.key">
			<ButtonMenuItem
				class="mt-1"
				:menu-option="menuOption"
				:handleMenuClick="handleMenuClick"
				:selected-key="internalSelectedKey"
				:expanded-keys="internalExpandedKeys"
				:render-prefix="renderPrefix"
				:render-label="renderLabel"
				:render-suffix="renderSuffix"
			/>
			<div v-if="internalExpandedKeys.includes(menuOption.key)" class="children-menu ">
				<GroupMenu
					v-if="menuOption.children"
					:menuOptions="menuOption.children"
					class="pl-3"
					:selected-key="internalSelectedKey"
					:expanded-keys="internalExpandedKeys"
					:render-prefix="renderPrefix"
					:render-label="renderLabel"
					:render-suffix="renderSuffix"
					@update:selected-key="updateSelectedKey"
					@update:expanded-keys="updateExpandedKeys"
				/>
				<CreateNewOneItem
					v-if="menuOption.createNewOne && isEmpty(menuOption.children)"
					:menu-option="menuOption"
					:create-new-one="menuOption.createNewOne"
				/>
			</div>
		</div>
	</n-flex>
</template>

<script setup lang="ts">
import {PropType, ref, VNodeChild, watch} from "vue";
import ButtonMenuItem from "@render/components/GroupMenu/ButtonMenuItem.vue";
import {GroupMenuOption} from "@render/components/GroupMenu/types";
import {useVModel} from "@vueuse/core";
import {isEqual, isEmpty} from "lodash-es";
import CreateNewOneItem from "@render/components/GroupMenu/CreateNewOneItem.vue";


const props = defineProps({
	menuOptions: Array as PropType<GroupMenuOption[]>,
	selectedKey: {
		type: String,
		default: '$undefined$'
	},
	expandedKeys: {
		type: Array as PropType<string[]>,
		default: ['$undefined$']
	},
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
	renderSuffix: {
		type: Function as PropType<({option, checked, selected}: {
			option: GroupMenuOption,
			checked: boolean,
			selected: boolean
		}) => VNodeChild>,
		default: undefined,
	},
})

const emit = defineEmits(['update:selectedKey', 'update:expandedKeys']);
const _selectKey = useVModel(props, 'selectedKey', emit)
const _expandKeys = useVModel(props, 'expandedKeys', emit)

// 记录 selectKey 是否受控
const selectedKeyControlled = ref<boolean>(_selectKey.value !== '$undefined$');
// 记录 expandedKeys 是否受控
const expandedKeysControlled = ref<boolean>(!isEqual(_expandKeys.value, ['$undefined$']));

const internalSelectedKey = ref<string | null>(_selectKey.value);
const internalExpandedKeys = ref<string[]>(_expandKeys.value || []);

const isSelectEmitting = ref(false);
const isExpandEmitting = ref(false);

watch(_selectKey, (newVal) => {
	if (selectedKeyControlled.value && !isSelectEmitting.value) {
		internalSelectedKey.value = newVal;
	}
})

watch(_expandKeys, (newVal) => {
	if (expandedKeysControlled.value && !isExpandEmitting.value) {
		internalExpandedKeys.value = newVal;
	}
})

// // 考虑两种情况：1.父组件不传入selectedKey，2.父组件传入selectedKey
const handleMenuClick = (option: GroupMenuOption) => {
	// Handle selection
	if (selectedKeyControlled.value) {
		isSelectEmitting.value = true;
		emit('update:selectedKey', option.key, option);
		isSelectEmitting.value = false;
	} else {
		internalSelectedKey.value = option.key;
	}

	// Handle expansion
	const index = internalExpandedKeys.value.indexOf(option.key);
	const newExpandedKeys = [...internalExpandedKeys.value];
	if (index > -1) {
		newExpandedKeys.splice(index, 1);
	} else {
		newExpandedKeys.push(option.key);
	}
	const expandedOptions = newExpandedKeys.map(key => {
		return props.menuOptions.find(option => option.key === key);
	});

	if (expandedKeysControlled.value) {
		isExpandEmitting.value = true;
		emit('update:expandedKeys', [...newExpandedKeys], expandedOptions);
		isExpandEmitting.value = false;
	} else {
		internalExpandedKeys.value = newExpandedKeys;
	}
}

const updateSelectedKey = (key: string, option: GroupMenuOption) => {
	if (selectedKeyControlled.value) {
		isSelectEmitting.value = true;
		emit('update:selectedKey', key, option);
		isSelectEmitting.value = false;
	} else {
		internalSelectedKey.value = option.key;
	}
};

const updateExpandedKeys = (keys: string[], options: GroupMenuOption[]) => {
	if (expandedKeysControlled.value) {
		isExpandEmitting.value = true;
		emit('update:expandedKeys', keys, options);
		isExpandEmitting.value = false;
	} else {
		internalExpandedKeys.value = keys;
	}
};


</script>

<style scoped lang="less">

</style>
