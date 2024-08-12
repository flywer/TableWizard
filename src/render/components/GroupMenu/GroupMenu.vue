<template>
	<n-flex class="w-full" justify="start" vertical :size="0">
		<div class="w-full" v-for="group in menuOptions" :key="group.key">
			<ButtonMenuItem
				class="mt-1"
				:group="group"
				:handleMenuClick="handleMenuClick"
				:activeKey="activeKey"
			/>
			<div v-if="group?.expanded && group.children" class="children-menu"
					 v-show="group?.expanded && group.children">
				<GroupMenu :menuOptions="group.children" class="pl-3"/>
			</div>
		</div>
	</n-flex>
</template>

<script setup lang="ts">
import {h, PropType, ref} from "vue";
import ButtonMenuItem from "@render/components/GroupMenu/ButtonMenuItem.vue";
import {GroupMenuOption} from "@render/components/GroupMenu/types";

const props = defineProps({
	menuOptions: Array as PropType<GroupMenuOption[]>,
	selectedKey: String,
})

const renderSwitcherIconWithExpanded = ({expanded}: { expanded: boolean }) => {
	return expanded ?
		h('div', {class: 'i-tabler:chevron-down'}) : h('div', {class: 'i-tabler:chevron-right'})
}

const activeKey = ref<string>(null)

const handleMenuClick = (option: GroupMenuOption) => {
	console.log(option)
	if (!option.children) {
		activeKey.value = option.key
			console.log(option.key)
	} else {
		// 展开或收起子菜单
		props.menuOptions.forEach(item => {
			if (item.key === option.key) {
				// 展开或收起
				item.expanded = !item.expanded
			}
		})
	}
}
</script>

<style scoped lang="less">

</style>
