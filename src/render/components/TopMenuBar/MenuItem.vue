<template>
	<n-card
		class="item-card no-drag w-full"
		content-class="menu-item"
		:bordered="false"
		:content-style="{padding:0}"
		:style="{backgroundColor:
		useTopMenu.activeItemKey === menuKey ? useThemeVars().value.modalColor : defaultColor}"
		:draggable="!isMain"
		@dragstart="handleDragStart"
		@dragover="handleDragOver"
		@dragend="handleDragEnd"
		@dragenter="handleDragEnter"
		@mouseenter="handleMouseEnter($event)"
		@mouseleave="handleMouseLeave($event)"
		@click="handleClick"
	>
		<div v-if="isMain" class="absolute top-1.5 left-1.5 left-icon">
			<slot name="leftIcon"/>
		</div>
		<div
			class="absolute top-1 overflow-hidden whitespace-nowrap text-ellipsis"
			:class="isMain ? 'left-7 right-2':'left-3 right-4.5'"
		>
			<span class="text-xs select-none" :title="title">{{ props.title }}</span>
		</div>
		<div v-if="closeable" class="absolute top-1.5 right-1.5">
			<n-button v-show="showCloseBtn" size="tiny" quaternary class="w-4 h-4" @click.stop="handleClose">
				<template #icon>
					<div class="i-material-symbols:close-rounded"/>
				</template>
			</n-button>
		</div>
	</n-card>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useTopMenuStore} from "@render/stores/useTopMenu";
import {useThemeVars} from "naive-ui";
import {useRouter} from "vue-router";
import {useProjectPageStore} from "@render/stores/useProjectPage";

const props = defineProps({
	isMain: {
		type: Boolean,
		default: false
	},
	closeable: {
		type: Boolean,
		default: true
	},
	menuKey: {
		type: Number,
		required: true
	},
	title: String
})

const router = useRouter();

const useTopMenu = useTopMenuStore()
const useProjectPage =useProjectPageStore()

const themeVars = useThemeVars().value
const defaultColor = themeVars.railColor
const activeColor = themeVars.modalColor

// 悬浮时显示关闭按钮
const showCloseBtn = ref(false)

const handleDragStart = (e: DragEvent) => {
	useTopMenu.dragItemKey = props.menuKey
	useTopMenu.targetItemKey = null
}

const handleDragOver = (e: DragEvent) => {
	e.preventDefault();

	// 实时更新拖拽指针显示
	if (props.isMain) {
		e.dataTransfer.dropEffect = 'none';
	} else if (useTopMenu.dragItemKey === props.menuKey) {
		e.dataTransfer.dropEffect = 'none';
	} else {
		e.dataTransfer.dropEffect = 'move';
	}
}

const handleDragEnd = (e: DragEvent) => {
	e.preventDefault();
	useTopMenu.switchItem(useTopMenu.dragItemKey, useTopMenu.targetItemKey)
}

const handleDragEnter = (e: DragEvent) => {
	e.preventDefault();
	// 获取当前拖拽位置的目标
	if (!props.isMain && useTopMenu.dragItemKey != props.menuKey) {
		useTopMenu.targetItemKey = props.menuKey
	}
}

const handleMouseEnter = (event: any) => {
	showCloseBtn.value = true
	// 改变card的背景色
	if (useTopMenu.activeItemKey === props.menuKey) return
	event.target.style.backgroundColor = activeColor
}

const handleMouseLeave = (event: any) => {
	showCloseBtn.value = false
	// 改变card的背景色
	if (useTopMenu.activeItemKey === props.menuKey) return
	event.target.style.backgroundColor = defaultColor
}

const handleClick = () => {
	useTopMenu.activeItemKey = props.menuKey
	useTopMenu.routerTo(props.menuKey)
}

const handleClose = () => {
	useTopMenu.removeMenuItem(props.menuKey)
	useProjectPage.removeItem(props.menuKey)
}
</script>

<style scoped lang="less">

</style>
