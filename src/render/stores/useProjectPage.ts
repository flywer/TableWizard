import {defineStore} from "pinia";
import {router} from "@render/router";
import {RouteName} from "@common/constants/app/RouteName";
import {GroupMenuOptionType} from "@render/components/GroupMenu/types";

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

	splitSize: string // 记录页面的splitSize

	groupMenuSelectedKey: string // 记录groupMenu的选中项
	groupMenuExpandedKeys: string[] // 记录groupMenu的展开项

	modelActiveTabKey: string // 记录modelManager当前激活的tabPanel
	modelTabPanels: ModelTabPanel[] // 记录modelManager的tabPanel
}

export const useProjectPageStore = defineStore({
	id: 'projectPage',
	state: () => ({
		projectStateMap: new Map<number, ProjectState>(), // 记录每个project的状态
	}),
	actions: {
		removeItem(projectId: number) {
			this.projectStateMap.delete(projectId)
		},
		// 初始化 projectStateMap
		initProjectState(projectId: number, state?: ProjectState) {
			this.projectStateMap.set(projectId, {
				activeSideMenuItemKey: state ? state.activeSideMenuItemKey : RouteName.modelManager,

				splitSize: state ? state.splitSize : '200px',

				groupMenuSelectedKey: state ? state.groupMenuSelectedKey : null,
				groupMenuExpandedKeys: state ? state.groupMenuExpandedKeys : [],

				modelActiveTabKey: state ? state.modelActiveTabKey : null,
				modelTabPanels: state ? state.modelTabPanels : []
			})
			return this.projectStateMap.get(projectId)
		},
		// 最左侧菜单点击事件
		async siderMenuRouteTo(projectId: number) {
			const pathName: string = this.projectStateMap.get(projectId).activeSideMenuItemKey
			await router.push({name: pathName, query: {projectId}})
		},
		getModelTabPanels(projectId: number): ModelTabPanel[] {
			const state = this.projectStateMap.get(projectId)
			if (state) {
				return state.modelTabPanels
			} else {
				return this.initProjectState(projectId).modelTabPanels
			}
		},
		// 添加modelTabPanel
		addModelTabPanel(projectId: number, tabPanel: ModelTabPanel, active?: boolean) {
			if (this.hasModelTabPanel(projectId, tabPanel.key)) {
				return
			}

			const state = this.projectStateMap.get(projectId)

			state.modelTabPanels.push(tabPanel)

			// 如果当前没有激活的TabPanel则激活此TabPanel
			if (state.modelActiveTabKey == null) {
				state.modelActiveTabKey = tabPanel.key
				return;
			}

			// 主动激活
			if (active) {
				state.modelActiveTabKey = tabPanel.key
			}
		},
		// 激活modelTabPanel
		activeModelTabPanel(projectId: number, tabPanel: ModelTabPanel) {
			if (this.hasModelTabPanel(projectId, tabPanel.key)) {
				const state = this.projectStateMap.get(projectId)
				state.modelActiveTabKey = tabPanel.key
			} else {
				this.addModelTabPanel(projectId, tabPanel, true)
			}
		},
		removeModelTabPanel(projectId: number, key: string) {
			const modelTabPanels: ModelTabPanel[] = this.projectStateMap.get(projectId).modelTabPanels
			const modelActiveTabKey: string = this.projectStateMap.get(projectId).modelActiveTabKey

			const index = modelTabPanels.findIndex((panel) => panel.key === key)

			if (!~index) return

			// 移除tabPanel
			modelTabPanels.splice(index, 1)

			// 如果移除的当前激活的tabPanel，则激活其前一个
			if (modelActiveTabKey === key) {
				const newKey = modelTabPanels[Math.min(index, modelTabPanels.length - 1)]?.key

				this.projectStateMap.get(projectId).modelActiveTabKey = newKey
				this.projectStateMap.get(projectId).groupMenuSelectedKey = newKey
			}
		},
		// 根据key判断tabPanel是否存在于modelTabPanels中
		hasModelTabPanel(projectId: number, key: string) {
			return this.getModelTabPanels(projectId).some((panel) => panel.key === key)
		}
	}
})
