import {defineStore} from "pinia";
import {router} from "@render/router";
import {RouteName} from "@common/constants/app/RouteName";
import {GroupMenuOptionType} from "@render/components/GroupMenu/types";
import {ProjectApi} from "@render/api/ProjectApi";
import {useModelManagerStore} from "@render/stores/useModelManager";

export interface TabPanel {
	key: string // tabPanel的key
	label: string // 标题
	tag?: string // 标签
}

export interface ModelTabPanel extends TabPanel {
	type: GroupMenuOptionType // 每个菜单的特有属性，控制着右侧Tab的渲染规则
}

export interface ProjectState {
	activeSideMenuItemKey: string // 当前激活的左侧菜单item的key


	groupMenuSelectedKey: string // 记录groupMenu的选中项
	groupMenuExpandedKeys: string[] // 记录groupMenu的展开项
}

export const useProjectPageStore = defineStore({
	id: 'projectPage',
	state: () => ({
		projectStateMap: new Map<number, ProjectState>(), // 记录每个project的状态
		projectDataMap: new Map<number, ProjectData>(), // 记录每个project的数据信息
	}),
	actions: {
		removeItem(projectId: number) {
			this.projectStateMap.delete(projectId)
		},
		// 初始化 projectStateMap
		initProjectState(projectId: number, state?: ProjectState) {
			this.projectStateMap.set(projectId, {
				activeSideMenuItemKey: state ? state.activeSideMenuItemKey : RouteName.modelManager,


				groupMenuSelectedKey: state ? state.groupMenuSelectedKey : null,
				groupMenuExpandedKeys: state ? state.groupMenuExpandedKeys : [],
			})

			useModelManagerStore().init(projectId)

			return this.projectStateMap.get(projectId)
		},
		// 根据项目路径初始化项目数据
		async initProjectData(projectId: number) {
			const projectData = await ProjectApi.getProjectData(projectId)
			this.projectDataMap.set(projectId, projectData)
		},
		// 最左侧菜单点击事件
		async siderMenuRouteTo(projectId: number) {
			const pathName: string = this.projectStateMap.get(projectId).activeSideMenuItemKey
			await router.push({name: pathName, query: {projectId}})
		},
	}
})
