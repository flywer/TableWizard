<template>
  <div>
    <div class="absolute top-0 left-0 right-0 h-10">
      <n-flex justify="space-between" align="center" class="pr-4">
        <n-text class="whitespace-nowrap overflow-hidden text-ellipsis text-lg" depth="2">类型管理</n-text>
        <n-button :size="'small'" text @click="useTypeManager.updateSplitSize(projectId,'0px')">
          <template #icon>
            <div class="i-lets-icons:expand-left-stop"/>
          </template>
        </n-button>
      </n-flex>
    </div>
    <div class="absolute top-10 left-0 right-4 bottom-0">
      <GroupMenu
          :menu-options="useTypeManager.menuOption"
          :selected-key="useTypeManager.stateMap.get(projectId).groupMenuSelectedKey"
          :expanded-keys="useTypeManager.stateMap.get(projectId).groupMenuExpandedKeys"
          :render-prefix="customPrefix"
          :render-label="renderLabel"
          :render-suffix="customSuffix"
          @update:selected-key="handleUpdateSelectedKey"
          @update:expanded-keys="handleUpdateExpandedKey"
      />
    </div>
    <n-dropdown
        trigger="manual"
        placement="bottom-start"
        :size="'small'"
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
import {NButton, NFlex, NText, useThemeVars} from "naive-ui"
import {useTypeManagerStore} from "@render/stores/useTypeManager";

const props = defineProps({
  projectId: Number
})

const useTypeManager = useTypeManagerStore()

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
  if (key === 'dataType') {
    return;
  } else if (option.type === 'datatype') {
    // 打开数据表
    useTypeManager.addTabPanel(props.projectId, {
      panelOptions: {
        key: key,
        label: option.label,
        type: 'datatype'
      },
      modelOptions: {
        id: key,
      }
    }, true)
  }
}

const handleUpdateExpandedKey = (keys: string[], options: GroupMenuOption[]) => {
  useTypeManager.updateGroupMenuExpandedKeys(props.projectId, keys)
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
    return renderMenuIcon(`i-tabler:table-options ${actionColor}`)
  } else if (option.key.endsWith('-root')) {
    return renderMenuIcon(`i-tabler:folder ${actionColor}`)
  } else if (option.type === 'folder') {
    return renderMenuIcon(`i-tabler:folder ${actionColor}`)
  } else {
    return renderMenuIcon(`i-tabler:table ${actionColor}`)
  }
}

const renderLabel = ({option, checked, selected}: {
  option: GroupMenuOption,
  checked: boolean,
  selected: boolean
}) => {
  if (option.key === 'dataType') {
    const expandedKeys = useTypeManager.stateMap.get(props.projectId).groupMenuExpandedKeys
    const isExpanded = expandedKeys.includes(option.key)

    let className = ''
    if (useTypeManager.hasChildrenMenu(option.key, useTypeManager.menuOption)) {
      className = 'i-material-symbols:arrow-right-rounded ' + (isExpanded ? 'rotate-90' : '')
    } else {
      className = 'i-material-symbols:arrow-right-rounded ' + (isExpanded ? 'rotate-90' : '')
    }

    return h(NFlex, {size: 4, wrap: false, align: 'center'}, () => [
      h(NText, null, '数据类型'),
      h('div', {class: className})
    ])
  }

  return h(NText, {class: 'whitespace-nowrap overflow-hidden text-ellipsis flex-1 line-height-18px'}, () => option.label)
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
  dataTable: datatableGroupDropdownOptions,
  dataType: [
    {
      label: '新建数据类型',
      key: 'createDataType',
      icon: () => h('div', {class: 'i-tabler:plus'})
    }
  ]
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

/**
 * 这里控制所有的下拉菜单的点击事件
 **/
const handleDropdownSelect = (key: string) => {
  switch (key) {
    case 'createDatatable':
      let parentId = null
      if (dropdownParam.menuOption.key !== 'dataTable') {
        parentId = dropdownParam.menuOption.key
      }
      useTypeManager.addNewDataTypeTabPanel(props.projectId, parentId, true)
      break
    case 'createFolder':
      // handleCreateFolder()
      break
  }

  dropdownParam.show = false
}
</script>

<style scoped lang="less">
</style>
