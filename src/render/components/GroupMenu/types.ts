export type GroupMenuOptionType = 'overview' | 'folder' | 'datatable'

export type GroupMenuOption = {
    menuType: 'group' | 'tree' // GroupMenu控制自身菜单渲染规则的属性
    type: GroupMenuOptionType // 每个菜单的特有属性，控制着右侧Tab的渲染规则
    label: string
    key: string
    icon?: string
    hiddenExpandIcon?: boolean
    children?: GroupMenuOption[]
    [key: string]: any
}
