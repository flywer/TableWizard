<template>
  <n-button
      id="menu-button"
      quaternary
      tag="span"
      class="pl-1 w-full pl-1 pr-1"
      @click="handleMenuClick(menuOption)"
      :style="{backgroundColor: selectedKey === menuOption.key ? useThemeVars().value.buttonColor2Hover : ''}"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
  >
    <template #default>
		<span class="relative top-0 left-0 right-0 bottom-0 w-full">
			<n-flex :size="0" align="center">
				<component v-if="!isGroup" :is="renderExpandIcon"/>
        <n-flex class="flex-grow-2" :size="0" align="center">
           <span v-if="renderPrefix">
					   <component
                 :is="renderPrefix({ option: menuOption, checked: false, selected: selectedKey === menuOption.key })"/>
			      </span>
            <span class="flex-grow-2  text-left">
                  <n-text depth="2">{{ menuOption.label }}</n-text>
            </span>
          <n-flex class="suffix-content"
                  :class="suffixAlwaysShow ? 'visibility-visible' : showSuffix ? 'visibility-visible' :'' " :size="0"
                  v-if="renderSuffix">
            <component
                :is="renderSuffix({ option: menuOption, checked: false, selected: selectedKey === menuOption.key })"/>
          </n-flex>
        </n-flex>
			</n-flex>
		</span>
    </template>
  </n-button>
</template>

<script setup lang="ts">
import {useThemeVars} from "naive-ui";
import {computed, h, PropType, ref, VNodeChild} from "vue";
import {GroupMenuOption} from "@render/components/GroupMenu/types";

const props = defineProps({
  menuOption: Object as PropType<GroupMenuOption>,
  selectedKey: String,
  expandedKeys: Array as PropType<string[]>,
  handleMenuClick: Function as PropType<(option: GroupMenuOption) => void>,
  renderPrefix: {
    type: Function as PropType<({option, checked, selected}: {
      option: GroupMenuOption,
      checked: boolean,
      selected: boolean
    }) => VNodeChild>,
    default: undefined,
  },
  suffixAlwaysShow: {
    type: Boolean,
    default: false,
  },
  renderSuffix: {
    type: Function as PropType<({option, checked, selected}: {
      option: GroupMenuOption,
      checked: boolean,
      selected: boolean
    }) => VNodeChild>,
    default: undefined,
  },
});

const isGroup = computed(() => {
  return props.menuOption.menuType === 'group';
});

const isExpanded = computed(() => {
  if (props.expandedKeys) {
    return props.expandedKeys.includes(props.menuOption.key);
  }
  return false
});


/**
 * 渲染展开的图标
 **/
const renderExpandIcon = () => {
  if (props.menuOption.children) {
    if (isExpanded.value) {
      return h('div', {class: 'i-tabler:chevron-down w-3'})
    } else {
      return h('div', {class: 'i-tabler:chevron-right w-3'})
    }
  } else {
    return null;
  }
}

const showSuffix = ref(false);

const handleMouseOver = () => {
  if (!props.suffixAlwaysShow) {
    showSuffix.value = true;
  }
}

const handleMouseLeave = () => {
  if (!props.suffixAlwaysShow) {
    showSuffix.value = false;
  }
}
</script>

<style scoped lang="less">
#menu-button:deep(.n-button__content) {
  width: 100%;
}

#menu-button .suffix-content {
  visibility: hidden; /* 默认隐藏子按钮 */
}

#menu-button:hover .suffix-content {
  visibility: visible; /* 默认隐藏子按钮 */
}

</style>
