import {defineStore} from "pinia";
import {router} from "@render/router";
import {RouteName} from "@common/constants/app/RouteName";

export interface ProjectState {
	activeSideMenuItemKey: string // 当前激活的左侧菜单item的key
}


export const useProjectPageStore = defineStore({
	id: 'projectPage',
	state: () => ({
		activeSideMenuItemKey: null as string,  // 此为当前激活的左侧菜单item的key
		projectStateMap: new Map<number, ProjectState>(),
	}),
	actions: {
		addItem(projectId: number, state: ProjectState) {

		},
		removeItem(projectId: number) {

		},
		async routeTo(projectId: number) {

			console.log(projectId)
			console.log(this.activeSideMenuItemKey)

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
		}
	}
})
