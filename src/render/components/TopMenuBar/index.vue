<template>
	<div class="top-menu">
		<div class="absolute top-1 left-0 w-19">
			<MenuItem :is-main="true" :menuKey="0" title="主窗口" :closeable="false" class="h-8 w-19  ">
				<template #leftIcon>
					<div class="i-ph:house w-5 h-5"/>
				</template>
			</MenuItem>
		</div>

		<div>
			<n-grid
				ref="menuGrid"
				class="absolute top-1 left-22 right-0"
				cols="2 400:4 600:6 1000:7 1200:8 1400:9 1600:10"
				x-gap="4"
				:collapsed="true"
				:collapsed-rows="1">
				<n-gi class="menu-grid-item" v-for="item in useTopMenu.menuItemOptions" :key="item.name">
					<MenuItem :title="item.name" :menuKey="item.key" class="h-8"/>
				</n-gi>
				<n-gi
					v-if="useTopMenu.hiddenStartIndex && useTopMenu.hiddenStartIndex > 0 && dropdownMenuItemOptions.length > 0"
					suffix>
					<div>
						<n-dropdown
							:size="'small'"
							:options="dropdownMenuItemOptions"
							placement="bottom-start"
							trigger="click"
							@select="handleDropDownSelect"
						>
							<n-button quaternary size="small" class="no-drag h-8">
								<n-text class="text-lg">+</n-text>
								<n-text>{{ dropdownMenuItemOptions.length }}</n-text>
							</n-button>
						</n-dropdown>
					</div>
				</n-gi>
			</n-grid>
		</div>
	</div>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import MenuItem from "@render/components/TopMenuBar/MenuItem.vue";
import {useTopMenuStore} from "@render/stores/useTopMenu";

defineOptions({name: 'TopMenuBar'})

const useTopMenu = useTopMenuStore()

const menuGrid = ref()

// 计算被隐藏的下拉菜单值
const dropdownMenuItemOptions = computed(() => {
	if (useTopMenu.hiddenStartIndex === null || useTopMenu.hiddenStartIndex >= useTopMenu.menuItemOptions.length) {
		return []
	}

	return useTopMenu.menuItemOptions.slice(useTopMenu.hiddenStartIndex).map((v) => ({
		label: v.name,
		key: v.key,
	}))
})

const checkOverflow = () => {
	// 需要等待页面渲染完成后再执行checkOverflow
	setTimeout(() => {
		const gridMenuItems = document.querySelectorAll('.menu-grid-item');
		// 根据item.clientWidth判断当前item是否因为溢出而隐藏，获取其索引
		for (let i = 0; i < gridMenuItems.length; i++) {
			if (gridMenuItems.item(i).clientWidth === 0) {
				useTopMenu.hiddenStartIndex = i
				// console.log(useTopMenu.hiddenStartIndex)
				break
			}
			useTopMenu.hiddenStartIndex = null
		}
	}, 50)
};

const handleDropDownSelect = (key: number) => {
	useTopMenu.switchItem(key, useTopMenu.menuItemOptions[useTopMenu.hiddenStartIndex - 1])
	useTopMenu.activeMenuItem(key)
}

onMounted(() => {
	useTopMenuStore().init()
	checkOverflow()
	window.addEventListener('resize', checkOverflow)
})

onUnmounted(() => {
	window.removeEventListener('resize', checkOverflow)
})

watch(useTopMenu.menuItemOptions, () => {
	checkOverflow()
})

watch(dropdownMenuItemOptions, (value) => {
	// 如果溢出菜单里包含了激活的菜单项，则将激活的菜单项移动至索引hiddenStartIndex-1位置
	if (useTopMenu.activeItemKey && value.some((v) => v.key === useTopMenu.activeItemKey)) {
		const hiddenStartItem = useTopMenu.menuItemOptions[useTopMenu.hiddenStartIndex - 1]
		useTopMenu.switchItem(useTopMenu.activeItemKey, hiddenStartItem.key)
	}
})

// 监听menuGrid的宽度变化
/*watch(menuGrid, (value) => {
	console.log(value)
	if (value) {
		value.$el.addEventListener('resize', checkOverflow)
	}
})*/

</script>

<style scoped>
</style>
