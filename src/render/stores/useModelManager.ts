import {defineStore} from "pinia";
import {ModelTabPanel} from "@render/stores/useProjectPage";
import {v4 as uuid} from 'uuid';
import {GroupMenuOption} from "@render/components/GroupMenu/types";
import {ModelApi} from "@render/api/ModelApi";

export interface ModelManagerSate {
	splitSize: string // 记录页面的splitSize

	groupMenuSelectedKey: string // 记录groupMenu的选中项
	groupMenuExpandedKeys: string[] // 记录groupMenu的展开项

	activeTabKey: string // 记录modelManager当前激活的tabPanel
	tabPanels: ModelTabOptions[] // 记录modelManager的tabPanel
}

export interface ModelOptions {
	id: string
	parentId?: string
}

/**
 * 模型管理中一个标签页的配置
 **/
export interface ModelTabOptions {
	panelOptions: ModelTabPanel, // 标签页的配置
	modelOptions: ModelOptions // 模型配置
}

export const useModelManagerStore = defineStore({
	id: 'modelManager',
	state: () => ({
		menuOption: [] as GroupMenuOption[],
		stateMap: new Map<number, ModelManagerSate>(), // 记录每个project的modelManage的页面状态
	}),
	actions: {
		init(projectId: number) {
			this.menuOptionInit(projectId)

			this.stateMap.set(projectId, {
				splitSize: '200px',
				groupMenuSelectedKey: null,
				groupMenuExpandedKeys: [],
				activeTabKey: null,
				tabPanels: []
			})
		},
		async menuOptionInit(projectId: number) {
			const datatableMenu = await ModelApi.getDataTableMenu(projectId)

			this.menuOption = [
				{
					menuType: 'group',
					key: 'overview',
					label: '项目概览',
					type: 'overview',
				},
				{
					menuType: 'group',
					key: 'dataTable',
					label: '数据表',
					type: 'folder',
					children: datatableMenu ? [datatableMenu] : undefined,
					createNewOne: ({option}: {
						option: GroupMenuOption,
						checked: boolean,
						selected: boolean
					}) => {
						this.addNewDataTableTabPanel(projectId, null, true)
					}
				},
			]
		},
		getTabPanels(projectId: number): ModelTabOptions[] {
			return this.stateMap.get(projectId)?.tabPanels || []
		},
		// 根据key判断tabPanel是否存在
		hasTabPanel(projectId: number, key: string) {
			const state: ModelManagerSate = this.stateMap.get(projectId)
			if (state?.tabPanels) {
				return state.tabPanels.some((panel) => panel.panelOptions.key === key)
			} else {
				return false
			}
		},
		// 添加一个tabPanel
		addTabPanel(projectId: number, options: ModelTabOptions, active?: boolean) {
			// 如果已经存在则激活
			if (this.hasTabPanel(projectId, options.panelOptions.key)) {
				// 主动激活
				if (active) {
					this.activeTabPanel(projectId, options.panelOptions.key)
				}
				return
			}

			const state: ModelManagerSate = this.stateMap.get(projectId)
			state.tabPanels.push(options)

			// 如果当前没有激活的TabPanel则激活此TabPanel
			if (state.activeTabKey == null) {
				state.activeTabKey = options.panelOptions.key
				return;
			}

			// 主动激活
			if (active) {
				this.activeTabPanel(projectId, options.panelOptions.key)
			}
		},
		addOverviewTabPanel(projectId: number, active?: boolean) {
			const state: ModelManagerSate = this.stateMap.get(projectId)
			if (state.tabPanels.some((panel) => panel.panelOptions.key === 'overview')) {
				this.activeTabPanel(projectId, 'overview')
			} else {
				this.addTabPanel(projectId, {
					panelOptions: {
						key: 'overview',
						label: '项目总览',
						type: 'overview'
					},
					modelOptions: {
						id: null,
						parentId: null
					}
				}, active)
			}
		},
		// 移除一个tabPanel
		removeTabPanel(projectId: number, key: string) {
			const state: ModelManagerSate = this.stateMap.get(projectId)
			const index = state.tabPanels.findIndex((panel) => panel.panelOptions.key === key)
			if (index >= 0) {
				state.tabPanels.splice(index, 1)
			}

			// 如果移除的当前激活的tabPanel，则激活其前一个
			if (state.activeTabKey === key) {
				state.activeTabKey = state.tabPanels[Math.min(index, state.tabPanels.length - 1)]?.panelOptions.key
				state.groupMenuSelectedKey = state.activeTabKey
			}
		},
		activeTabPanel(projectId: number, key: string) {
			const state: ModelManagerSate = this.stateMap.get(projectId)
			state.activeTabKey = key
			state.groupMenuSelectedKey = key
		},
		updateGroupMenuSelectedKey(projectId: number, key: string) {
			this.stateMap.get(projectId).groupMenuSelectedKey = key
		},
		updateGroupMenuExpandedKeys(projectId: number, keys: string[]) {
			this.stateMap.get(projectId).groupMenuExpandedKeys = keys
		},
		// 添加一个新的数据表TabPanel
		addNewDataTableTabPanel(projectId: number, parentId: string, active?: boolean) {
			const id = uuid()
			this.addTabPanel(projectId, {
				panelOptions: {
					key: id,
					label: '新建数据表',
					type: 'datatable'
				},
				modelOptions: {
					id: id,
					parentId: parentId
				}
			}, active)
		},
		// 根据key查找菜单项
		findMenuByKey(key: string, children: GroupMenuOption[]): GroupMenuOption {
			for (const item of children) {
				if (item.key === key) {
					return item
				}

				if (item.children) {
					const result = this.findMenuByKey(key, item.children)
					if (result) {
						return result
					}
				}
			}
		},
		// 判断是否有子菜单
		hasChildrenMenu(key: string, children: GroupMenuOption[]): boolean {
			const option = this.findMenuByKey(key, children)
			if (option && option.children && option.children.length > 0) {
				return true
			} else {
				return false
			}
		},
		updateTabPanelLabel(projectId: number, key: string, label: string) {
			const state: ModelManagerSate = this.stateMap.get(projectId)
			const panel = state.tabPanels.find((panel) => panel.panelOptions.key === key)
			if (panel) {
				panel.panelOptions.label = label
			}
		},
		updateSplitSize(projectId: number,size:string){
			this.stateMap.get(projectId).splitSize = size
		}
	}
});
