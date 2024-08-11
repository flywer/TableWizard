import {defineStore} from "pinia";
import {router} from "@render/router";
import {RouteName} from "@common/constants/app/RouteName";

export type  MenuItemOption = {
	name: string
	key: number
	isMain?: boolean
}

export interface TopMenu {
	menuItemOptions: MenuItemOption[],
	activeItemKey: number, // 当前激活的item key

	hiddenStartIndex: number, // 存储开始被隐藏的菜单的索引

	dragItemKey: number, // 拖拽的item key
	targetItemKey: number, // 目标item key
}


export const useTopMenuStore = defineStore({
	id: 'topMenu',
	state: (): TopMenu => ({
		menuItemOptions: [],
		activeItemKey: null,
		hiddenStartIndex: null,
		dragItemKey: null,
		targetItemKey: null,
	}),
	actions: {
		async init() {
			await this.routerTo(this.activeItemKey)
		},
		switchItem(key: number | MenuItemOption, targetKey: number | MenuItemOption) {
			// 根据key找到对应的item
			if (typeof key !== 'number') {
				key = key.key
			}
			if (typeof targetKey !== 'number') {
				targetKey = targetKey.key
			}

			const dragItem = this.menuItemOptions.find((item: MenuItemOption) => item.key === key)
			const targetItem = this.menuItemOptions.find((item: MenuItemOption) => item.key === targetKey)

			// 交换两个item的位置
			if (dragItem && targetItem) {
				const dragIndex = this.menuItemOptions.indexOf(dragItem)
				const targetIndex = this.menuItemOptions.indexOf(targetItem)
				this.menuItemOptions.splice(dragIndex, 1, targetItem)
				this.menuItemOptions.splice(targetIndex, 1, dragItem)
			}
		},
		addMenuItem(option: MenuItemOption) {
			// 判断此item是否已经存在
			const index = this.menuItemOptions.findIndex(item => item.key === option.key)
			if (index === -1) {
				// 判断当前是否有被隐藏的菜单
				if (this.hiddenStartIndex) {
					// 添加到被隐藏的菜单的索引的前一个
					this.menuItemOptions.splice(this.hiddenStartIndex - 1, 0, option)
				} else {
					this.menuItemOptions.push(option)
				}
				// 如果当前没有激活的item，则激活
				if (this.activeItemKey === 0) {
					this.activeMenuItem(option)
				}
			} else {
				// 判断当前是否有被隐藏的菜单
				if (this.hiddenStartIndex) {
					// 移动到被隐藏的菜单的索引的前一个
					const hiddenStartItem = this.menuItemOptions[this.hiddenStartIndex - 1]
					this.switchItem(option.key, hiddenStartItem.key)
				}
				// 存在则直接跳转
				this.activeMenuItem(option)
			}
		},
		removeMenuItem(key: number) {
			const index = this.menuItemOptions.findIndex(item => item.key === key)
			if (index !== -1) {
				this.menuItemOptions.splice(index, 1)
				if (this.activeItemKey === key) {
					this.activeItemKey = 0
					this.routerTo(0)
				}
			}
		},
		activeMenuItem(arg: MenuItemOption | number) {
			if (typeof arg !== 'number') {
				arg = arg.key
			}
			this.activeItemKey = arg
			this.routerTo(arg)
		},
		async routerTo(key: number) {
			if (key === null || key === 0 || this.menuItemOptions.length === 0) {
				this.activeItemKey = 0
				await router.push(RouteName.home)
			} else {
				// 传参
				await router.push({name: RouteName.modelManager, query: {projectId: key}})
			}
		},
	},
	persist: true,
})
