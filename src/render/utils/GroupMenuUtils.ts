import {GroupMenuOption} from "@render/components/GroupMenu/types";
import {isEmpty} from "lodash";

export class GroupMenuUtils {
    static findOptionByKey(key: string, children: GroupMenuOption[]): GroupMenuOption {
        for (const item of children) {
            if (item.key === key) {
                return item
            }

            if (item.children) {
                const result = this.findOptionByKey(key, item.children)
                if (result) {
                    return result
                }
            }
        }
    }

    static hasChildrenMenu(key: string, children: GroupMenuOption[]): boolean {
        const option = this.findOptionByKey(key, children)
        if (option && !isEmpty(option.children)) {
            return true
        } else {
            return false
        }
    }
}
