<template>
  <div>
    <div class="absolute top-0 left-0 right-0 h-10">
      <n-flex justify="space-between" align="center">
        <n-h4
            class="whitespace-nowrap overflow-hidden text-ellipsis"
        >
          <n-text depth="2">模型管理</n-text>
        </n-h4>
      </n-flex>
    </div>
    <div class="absolute top-10 left-0 right-4 bottom-0">
      <GroupMenu
          :menu-options="menuOptions"
          :selected-key="useProjectPage.projectStateMap.get(projectId).groupMenuSelectedKey"
          :expanded-keys="useProjectPage.projectStateMap.get(projectId).groupMenuExpandedKeys"
          :render-prefix="customPrefix"
          :render-suffix="customSuffix"
          @update:selected-key="handleUpdateSelectedKey"
          @update:expanded-keys="handleUpdateExpandedKey"
      />
    </div>
    <n-dropdown
        trigger="manual"
        placement="bottom-start"
        :show="dropdownParam.show"
        :options="dropdownParam.options"
        :x="dropdownParam.x"
        :y="dropdownParam.y"
        @select="handleDropdownSelect"
        @clickoutside="handleClickoutside"
        @mouseleave="handleClickoutside"
    />
  </div>
</template>

<script setup lang="ts">
import {h, reactive} from "vue";
import GroupMenu from "@render/components/GroupMenu/GroupMenu.vue";
import {GroupMenuOption} from "@render/components/GroupMenu/types";
import {useProjectPageStore} from "@render/stores/useProjectPage";
import {NButton, useThemeVars} from "naive-ui"
import {v4} from "uuid";

const props = defineProps({
  projectId: Number
})

const useProjectPage = useProjectPageStore()

const menuOptions = reactive<GroupMenuOption[]>([
  {
    menuType: 'group',
    label: '项目概览',
    type: 'overview',
    key: 'overview',
    icon: 'i-tabler:layout-dashboard',
  },
  {
    menuType: 'group',
    label: '数据表',
    type: 'folder',
    key: 'dataTable',
    icon: 'i-tabler:table'
  },
])

const dropdownParam = reactive({
  show: false,
  options: [],
  menuOption: null,
  x: null,
  y: null
})

const handleClickoutside = () => {
  dropdownParam.show = false
}

const renderMenuIcon = (className: string) => {
  return h('div', {class: className + " text-lg mr-1"})
}

const handleUpdateSelectedKey = (key: string, option: GroupMenuOption) => {

  if (option.type === 'overview') {
    // open overview
    useProjectPage.activeModelTabPanel(props.projectId, {
      key: key,
      tag: '总览',
      label: '项目总览',
      type: 'overview'
    })
  } else if (option.type === 'datatable') {
    // open dataTable
    useProjectPage.activeModelTabPanel(props.projectId, {
      key: key,
      tag: '数据表',
      label: '数据表',
      type: 'datatable'
    })
  }
  // update selected key
  useProjectPage.projectStateMap.get(props.projectId).groupMenuSelectedKey = key
}

const handleUpdateExpandedKey = (keys: string[], options: GroupMenuOption[]) => {
  useProjectPage.projectStateMap.get(props.projectId).groupMenuExpandedKeys = keys
}

const customPrefix = ({option, checked, selected}: {
  option: GroupMenuOption,
  checked: boolean,
  selected: boolean
}) => {
  let actionColor = selected ? `text-[${useThemeVars().value.primaryColor}]` : ''
  // 清除actionColor里的空格
  actionColor = actionColor.replace(/\s+/g, '')

  if (option.key === 'overview') {
    return renderMenuIcon(`i-tabler:layout-dashboard ${actionColor}`)
  } else if (option.key === 'dataTable') {
    return renderMenuIcon(`i-tabler:table ${actionColor}`)
  }
}

const datatableGroupDropdownOptions = [
  {
    label: '新建数据表',
    key: 'createDatatable',
    icon: () => h('div', {class: 'i-tabler:table-plus'})
  },
  {
    label: '新建文件夹',
    key: 'createFolder',
    icon: () => h('div', {class: 'i-tabler:folder-plus'})
  }
]

const dropdownOptionsMap = {
  dataTable: datatableGroupDropdownOptions
}

const getDropdownOptionsMap = (option: GroupMenuOption) => {

  return
}

const customSuffix = ({option, checked, selected}: {
  option: GroupMenuOption,
  checked: boolean,
  selected: boolean
}) => {
  if (option.key !== 'overview') {
    return h(NButton,
        {
          size: 'tiny',
          class: 'hover:display-none',
          quaternary: true,
          onClick: (event) => {
            event.stopPropagation(); // 阻止事件冒泡到父元素

            dropdownParam.x = event.clientX;
            dropdownParam.y = event.clientY; // 将 y 设置为按钮下边缘

            dropdownParam.options = dropdownOptionsMap[option.key]
            dropdownParam.menuOption = option
            dropdownParam.show = true
          }
        },
        {
          icon: () => h('div', {class: 'i-material-symbols:more-horiz'})
        })
  } else {
    return null
  }
}

const handleDropdownSelect = (key: string) => {
  console.log(key)
  console.log(dropdownParam.menuOption)

  useProjectPage.activeModelTabPanel(props.projectId, {
    key: v4(),
    tag: null,
    label: '新建数据表',
    type: 'datatable'
  })

  dropdownParam.show = false
}

</script>

<style scoped lang="less">

</style>
