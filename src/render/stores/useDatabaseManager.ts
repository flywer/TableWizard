import {defineStore} from "pinia";
import {ModelManagerSate, ModelTabOptions} from "@render/stores/useModelManager";
import {GroupMenuOption} from "@render/components/GroupMenu/types";
import {v4 as uuid} from "uuid";
import {DatabaseApi} from "@render/api/DatabaseApi";

export interface ManagerSate {
    splitSize: string // 记录页面的splitSize

    groupMenuSelectedKey: string // 记录groupMenu的选中项
    groupMenuExpandedKeys: string[] // 记录groupMenu的展开项

    activeTabKey: string // 记录当前激活的tabPanel
    tabPanels: ModelTabOptions[] // 记录tabPanels
}

export const useDatabaseManager = defineStore({
    id: 'databaseManager',
    state: () => ({
        menuOption: [],
        stateMap: new Map<number, ManagerSate>(),
        typeData: new Map<number, any[]>(), // 数据库类型列表
        templateData: new Map<number, any[]>(),
        connectionData: new Map<number, any[]>(),
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

            this.modelData.set(projectId, [])
            this.templateData.set(projectId, [])
            this.connectionData.set(projectId, [])
        },
        // region menuOption
        async menuOptionInit(projectId: number) {
            // const datatableMenu = await ModelApi.getDataTableMenu(projectId)

            this.menuOption = [
                {
                    menuType: 'group',
                    key: 'overview1',
                    label: '类型管理',
                    type: 'folder',
                },
                {
                    menuType: 'group',
                    key: 'overview1',
                    label: '模板管理',
                    type: 'folder',
                },
                {
                    menuType: 'group',
                    key: 'dataTable',
                    label: '连接管理',
                    type: 'folder',
                    children: undefined,
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
        // region typeData
        async setTypeData(projectId: number, id: string) {
            const data: SaveDataTableVO[] = this.getProjectTypeData(projectId)
            if (data.some((item) => item.id === id)) {
                // 替换
                const index = data.findIndex((item) => item.id === id)
                const model = await DatabaseApi.getDatabase(projectId, id)
                if (model) {
                    data.splice(index, 1, model)
                }
            } else {
                const model = await DatabaseApi.getDatabase(projectId, id)
                if (model) {
                    data.push(model)
                }
            }
            this.modelData.set(projectId, data)
        },
        getProjectTypeData(projectId: number): SaveDataTableVO[] {
            return this.modelData.get(projectId)
        },
        getTypeData(projectId: number, id: string): SaveDataTableVO {
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
        hasTypeData(projectId: number, id: string): boolean {
            const data: SaveDataTableVO[] = this.modelData.get(projectId)
            return data.some((item) => item.id === id)
        },
        updateTypeDataFields(projectId: number, id: string, fields: EntityField[]) {
            const data: SaveDataTableVO[] = this.modelData.get(projectId)
            const model = data.find((item) => item.id === id)
            if (model) {
                model.fields = fields
            }
        }
        // updateTypeData
        // endregion
    }
})
