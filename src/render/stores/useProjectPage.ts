import {defineStore} from "pinia";
import {router} from "@render/router";
import {RouteName} from "@common/constants/app/RouteName";

export interface ProjectState {
	activeSideMenuItemKey?: string // 当前激活的左侧菜单item的key
	splitSize?: string // 记录页面的splitSize
}

export const useProjectPageStore = defineStore({
	id: 'projectPage',
	state: () => ({
		activeSideMenuItemKey: null as string,  // 此为当前激活的左侧菜单item的key
		projectStateMap: new Map<number, ProjectState>(),
	}),
	actions: {
		removeItem(projectId: number) {
			this.projectStateMap.delete(projectId)
		},
		loadActiveSideMenuItemKey(projectId: number) {
			// 当且仅当当前菜单设置过activeSideMenuItemKey时，才会加载，否则使用默认的modelManager
			if (this.projectStateMap.has(projectId)) {
				const state = this.projectStateMap.get(projectId)
				if (state.activeSideMenuItemKey) {
					this.activeSideMenuItemKey = state.activeSideMenuItemKey
				} else {
					this.projectStateMap.set(projectId, {
						activeSideMenuItemKey: RouteName.modelManager
					})
					this.activeSideMenuItemKey = RouteName.modelManager
				}
			} else {
				this.projectStateMap.set(projectId, {
					activeSideMenuItemKey: RouteName.modelManager
				})
				this.activeSideMenuItemKey = RouteName.modelManager
			}
		},

		async routeTo(projectId: number) {
			let pathName: string
			if (this.projectStateMap.has(projectId)) {
				// 若存在，则获取缓存
				pathName = this.projectStateMap.get(projectId).activeSideMenuItemKey
			} else {
				// 若不存在，则跳转到默认页面
				pathName = RouteName.modelManager
			}
			this.activeSideMenuItemKey = pathName
			await router.push({name: pathName, query: {projectId}})
		},
		updateSplitSize(projectId: number, splitSize: string) {
			if (this.projectStateMap.has(projectId)) {
				// 若存在，则获取缓存
				this.projectStateMap.get(projectId).splitSize = splitSize
			} else {
				// 若不存在，则新增
				this.projectStateMap.set(projectId, {activeSideMenuItemKey: null, splitSize})
			}
		},
		getSplitSize(projectId: number) {
			if (this.projectStateMap.has(projectId)) {
				// 若存在，则获取缓存
				return this.projectStateMap.get(projectId).splitSize
			} else {
				// 若不存在，则返回默认值
				return '200px'
			}
		}
	}
})
