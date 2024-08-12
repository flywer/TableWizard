export type GroupMenuOption = {
	menuType: 'group' | 'tree' //菜单节点是组还是树，影响子菜单
	label: string
	key: string
	icon: string
	hasExtraButton?: boolean
	expanded?: boolean
	children?: GroupMenuOption[]
}
