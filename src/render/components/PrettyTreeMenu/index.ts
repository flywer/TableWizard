import {DropdownOption, TreeOption} from "naive-ui";
import {h} from "vue";
import {isEmpty} from "lodash-es";

export interface PrettyTreeMenuOption extends TreeOption {
	// 隐藏展开图标
	hideExpandIcon?: boolean
	// 是否需要标签右侧的展开图标
	needLabelRightExpandIcon?: boolean
	// 下拉菜单选项
	dropdownOptions?: DropdownOption[]
	// 下拉菜单选项点击事件
	onDropdownSelect?: (key: string) => void
}

export type RenderMenuNodeInfo = {
	option: PrettyTreeMenuOption,
	checked: boolean,
	selected: boolean
}

export type UpdateSelectedKeysInfo = {
	keys: Array<string | number>,
	option: Array<PrettyTreeMenuOption | null>,
	meta: { node: PrettyTreeMenuOption | null, action: 'select' | 'unselect' }
}

export type UpdateExpandedKeysInfo = {
	keys: string[],
	options: Array<PrettyTreeMenuOption>
}

export class PrettyMenuUtils {
	static renderPrettyMenuIcon = (className: string, color?: string) => {
		return h('div', {class: className + " text-lg mr-1", style: {color: color}})
	}

	// 根据key查找菜单项
	static findNodeByKey(key: string, children: PrettyTreeMenuOption[]): PrettyTreeMenuOption {
		for (const item of children) {
			if (item.key === key) {
				return item
			}

			if (item.children) {
				const result = this.findNodeByKey(key, item.children)
				if (result) {
					return result
				}
			}
		}
	}

	// 根据key查找此菜单下是否有子菜单
	static findNodeHasChildren(key: string, children: PrettyTreeMenuOption[]): boolean {
		const option = this.findNodeByKey(key, children)
		return option && !isEmpty(option.children);
	}
}
