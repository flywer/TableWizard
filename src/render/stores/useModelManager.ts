import {defineStore} from "pinia";
import {ModelTabPanel} from "@render/stores/useProjectPage";
import {v4 as uuid} from 'uuid';
import {GroupMenuOption} from "@render/components/GroupMenu/types";
import {ModelApi} from "@render/api/ModelApi";
import {isEmpty} from "lodash-es";
import {PrettyMenuUtils, PrettyTreeMenuOption} from "@render/components/PrettyTreeMenu";
import {h} from "vue";
import {useTopMenuStore} from "@render/stores/useTopMenu";
import TablerCopy from "@render/components/icon/TablerCopy.vue";
import TablerFolderSymlink from "@render/components/icon/TablerFolderSymlink.vue";
import TablerTableExport from "@render/components/icon/TablerTableExport.vue";

export interface ModelManagerSate {
	splitSize: string // 记录页面的splitSize

	groupMenuSelectedKeys: string[] // 记录groupMenu的选中项
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
		menuOptions: [] as PrettyTreeMenuOption[],
		stateMap: new Map<number, ModelManagerSate>(), // 记录每个project的modelManage的页面状态
		modelData: new Map<number, SaveDataTableVO[]>(), // 记录每个project的model的数据
	}),
	actions: {
		init(projectId: number) {
			this.menuOptionInit(projectId)

			this.stateMap.set(projectId, {
				splitSize: '200px',
				groupMenuSelectedKey: null,
				groupMenuExpandedKeys: ['datatableRoot'],
				activeTabKey: null,
				tabPanels: []
			})

			this.modelData.set(projectId, [])
		},
		// region menuOption
		async menuOptionInit(projectId: number) {
			const datatableMenuOptions = await ModelApi.getDataTableMenu(projectId);
			let datatableRootMenuOptions: PrettyTreeMenuOption[]
			if (isEmpty(datatableMenuOptions)) {
				datatableRootMenuOptions = undefined
			} else {
				this.setMenuOptions(datatableMenuOptions)
				datatableRootMenuOptions = [{
					label: '根目录',
					key: 'datatableRoot',
					hideExpandIcon: true,
					prefix: () => PrettyMenuUtils.renderPrettyMenuIcon('i-tabler:folder'),
					children: datatableMenuOptions
				}]
			}
			this.menuOptions = [
				{
					key: 'overview',
					label: '项目概览',
					hideExpandIcon: true,
					prefix: () => PrettyMenuUtils.renderPrettyMenuIcon('i-tabler:layout-dashboard'),
				},
				{
					key: 'dataTableTree',
					label: '数据表',
					hideExpandIcon: true,
					needLabelRightExpandIcon: true,
					dropdownOptions: [
						{
							label: '新建数据表',
							key: 'createDatatable',
							icon: () => h('div', {class: 'i-tabler:table-plus'})
						},
						{
							label: '新建子目录',
							key: 'createFolder',
							icon: () => h('div', {class: 'i-tabler:folder-plus'})
						}
					],
					onDropdownSelect: (key: string) => {
						switch (key) {
							case 'createDatatable':
								let parentId = null
								const projectId = useTopMenuStore().activeItemKey
								this.addNewDataTableTabPanel(projectId, parentId, true)
								break
							case 'createFolder':
								// handleCreateFolder()
								break
						}
					},
					prefix: () => PrettyMenuUtils.renderPrettyMenuIcon('i-tabler:table-options'),
					children: datatableRootMenuOptions,
					createNewOne: ({option}: {
						option: GroupMenuOption,
						checked: boolean,
						selected: boolean
					}) => {
						this.addNewDataTableTabPanel(projectId, null, true)
					}
				},
			] as PrettyTreeMenuOption[]
		},
		// 递归为每个菜单项设置图标、下拉菜单
		setMenuOptions(options: PrettyTreeMenuOption[]) {
			options.forEach(option => {
				// 数据表节点
				if (option.key.toString().startsWith('datatable-')) {
					option.dropdownOptions = [
						{
							label: '重命名',
							key: 'rename',
							icon: () => h('div', {class: 'i-tabler:pencil-minus'})
						},
						{
							label: '复制',
							key: 'copy',
							icon: () => h(TablerCopy)
						},
						{
							label: '移动到',
							key: 'move',
							icon: () => h(TablerFolderSymlink)
						},
						{
							label: '导出',
							key: 'export',
							icon: () => h(TablerTableExport)
						},
						{
							type: 'divider'
						},
						{
							label: '删除',
							key: 'delete',
							icon: () => h('div', {class: 'i-tabler:trash'})
						},
					];
					option.onDropdownSelect = (key: string) => {

					}
				} else if (option.key.toString().startsWith('datatableFolder-')) {
					// 目录节点
					option.dropdownOptions = [
						{
							label: '新建数据表',
							key: 'createDatatable',
							icon: () => h('div', {class: 'i-tabler:table-plus'})
						},
						{
							label: '新建子目录',
							key: 'createFolder',
							icon: () => h('div', {class: 'i-tabler:folder-plus'})
						}
					];
					option.onDropdownSelect = (key: string) => {

					}
				}
				if (option.children) {
					this.setMenuOptions(option.children);
				}
			});
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
			if (option && !isEmpty(option.children)) {
				return true
			} else {
				return false
			}
		},
		// endregion
		// region stateMap
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
				state.groupMenuSelectedKeys = [state.activeTabKey]
			}
		},
		activeTabPanel(projectId: number, key: string) {
			const state: ModelManagerSate = this.stateMap.get(projectId)
			state.activeTabKey = key
			state.groupMenuSelectedKeys = [key]
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
		updateTabPanelLabel(projectId: number, key: string, label: string) {
			const state: ModelManagerSate = this.stateMap.get(projectId)
			const panel = state.tabPanels.find((panel) => panel.panelOptions.key === key)
			if (panel) {
				panel.panelOptions.label = label
			}
		},
		updateSplitSize(projectId: number, size: string) {
			this.stateMap.get(projectId).splitSize = size
		},
		// endregion
		// region modelData
		async setModelData(projectId: number, id: string) {
			const data: SaveDataTableVO[] = this.getProjectModelData(projectId)
			if (data.some((item) => item.id === id)) {
				// 替换
				const index = data.findIndex((item) => item.id === id)
				const model = await ModelApi.getDataTable(projectId, id)
				if (model) {
					data.splice(index, 1, model)
				}
			} else {
				const model = await ModelApi.getDataTable(projectId, id)
				if (model) {
					data.push(model)
				}
			}
			this.modelData.set(projectId, data)
		},
		getProjectModelData(projectId: number): SaveDataTableVO[] {
			return this.modelData.get(projectId)
		},
		getModelData(projectId: number, id: string): SaveDataTableVO {
			const data: SaveDataTableVO[] = this.modelData.get(projectId)
			const model = data.find((item) => item.id === id)
			if (model) {
				return model
			} else {
				return {
					id: id,
					projectId: projectId,
					parentId: null,
					tableName: '',
					tableComment: '',
					fields: []
				}
			}
		},
		hasModelData(projectId: number, id: string): boolean {
			const data: SaveDataTableVO[] = this.modelData.get(projectId)
			return data.some((item) => item.id === id)
		},
		updateModelDataFields(projectId: number, id: string, fields: EntityField[]) {
			const data: SaveDataTableVO[] = this.modelData.get(projectId)
			const model = data.find((item) => item.id === id)
			if (model) {
				model.fields = fields
			}
		}
		// updateModelData
		// endregion
	}
});
