<template>
	<n-tabs
		placement="top"
		type="card"
		style="height: 240px"
		class="relative"
	>
		<n-tab-pane name="oasis" tab="Oasis">
			<n-flex>
				<n-tabs
					key="main22"
					id="mian2"
					placement="left"
					type="line"
					style="height: 240px"
					class="relative"
				>
					<template #prefix>2222</template>
					<template #suffix>111</template>
					<n-tab-pane name="oasis" tab="Oasis">
						Wonderwall
					</n-tab-pane>
					<n-tab-pane name="the beatles" tab="the Beatles">
						Hey Jude
					</n-tab-pane>
					<n-tab-pane name="jay chou" tab="Jay Chou">
						Qilixiang
					</n-tab-pane>
					<n-tab-pane name="oasis1" tab="Oasis1">
						Wonderwall
					</n-tab-pane>
					<n-tab-pane name="the beatles1" tab="the Beatles1">
						Hey Jude
					</n-tab-pane>
					<n-tab-pane name="jay chou1" tab="Jay Chou1">
						Qilixiang
					</n-tab-pane>
					<n-tab-pane name="oasis2" tab="Oasis2">
						Wonderwall
					</n-tab-pane>
					<n-tab-pane name="the beatles2" tab="the Beatles2">
						Hey Jude
					</n-tab-pane>
					<n-tab-pane name="jay chou2" tab="Jay Chou2">
						Qilixiang
					</n-tab-pane>
					<n-tab-pane name="oasis3" tab="Oasis3">
						Wonderwall
					</n-tab-pane>
					<n-tab-pane name="the beatles3" tab="the Beatles3">
						Hey Jude
					</n-tab-pane>
					<n-tab-pane name="jay chou3" tab="Jay Chou3">
						Qilixiang
					</n-tab-pane>
					<n-tab-pane name="oasis4" tab="Oasis4">
						Wonderwall
					</n-tab-pane>
					<n-tab-pane name="the beatles4" tab="the Beatles4">
						Hey Jude
					</n-tab-pane>
					<n-tab-pane name="jay chou4" tab="Jay Chou4">
						Qilixiang
					</n-tab-pane>
					<n-tab-pane name="oasis5" tab="Oasis5">
						Wonderwall
					</n-tab-pane>
					<n-tab-pane name="the beatles5" tab="the Beatles5">
						Hey Jude
					</n-tab-pane>
					<n-tab-pane name="jay chou5" tab="Jay Chou5">
						Qilixiang
					</n-tab-pane>
				</n-tabs>
			</n-flex>
		</n-tab-pane>
		<n-tab-pane name="the beatles" tab="the Beatles">
			<n-tabs type="line" placement="left" style="height: 240px">
				<n-tab name="幸福">
					寂寞围绕着电视
				</n-tab>
				<n-tab name="的">
					垂死坚持
				</n-tab>
				<n-tab name="旁边">
					在两点半消失
				</n-tab>
				<n-tab name="旁边1">
					在两点半消失
				</n-tab>
				<n-tab name="旁边2">
					在两点半消失
				</n-tab>
				<n-tab name="旁边3">
					在两点半消失
				</n-tab>
				<n-tab name="旁边4">
					在两点半消失
				</n-tab>
				<n-tab name="旁边5">
					在两点半消失
				</n-tab>
				<n-tab name="旁边">
					在两点半消失
				</n-tab>
				<n-tab name="旁边">
					在两点半消失
				</n-tab>
			</n-tabs>
		</n-tab-pane>
		<n-tab-pane name="jay chou" tab="Jay Chou">
			<n-space vertical>
				<n-layout has-sider>
					<n-layout-sider
						bordered
						collapse-mode="width"
						:collapsed-width="64"
						:width="240"
						show-trigger
					>
						<n-menu
							v-model:value="activeKey"
							:collapsed="collapsed"
							:collapsed-width="64"
							:collapsed-icon-size="22"
							:options="menuOptions"
						/>
					</n-layout-sider>
					<n-layout>
						<span>内容</span>
					</n-layout>
				</n-layout>
			</n-space>
		</n-tab-pane>
		<n-tab-pane name="oasis1" tab="Oasis1">
			Wonderwall
		</n-tab-pane>
	</n-tabs>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {Component, h,ref} from "vue";
import {MenuOption, NIcon} from "naive-ui";

defineOptions({name: "ProjectTypeManager"})

const route = useRoute()

const activeKey =  ref<string | null>(null)
const collapsed = ref(false)
function renderIcon(icon: Component) {
	return () => h(NIcon, null, {default: () => h(icon)})
}

const menuOptions: MenuOption[] = [
	{
		label: '且听风吟',
		key: 'hear-the-wind-sing',
	},
	{
		label: '1973年的弹珠玩具',
		key: 'pinball-1973',
		disabled: true,
		children: [
			{
				label: '鼠',
				key: 'rat'
			}
		]
	},
	{
		label: '寻羊冒险记',
		key: 'a-wild-sheep-chase',
		disabled: true,
	},
	{
		label: '舞，舞，舞',
		key: 'dance-dance-dance',
		children: [
			{
				type: 'group',
				label: '人物',
				key: 'people',
				children: [
					{
						label: '叙事者',
						key: 'narrator',
					},
					{
						label: '羊男',
						key: 'sheep-man',

					}
				]
			},
			{
				label: '饮品',
				key: 'beverage',

				children: [
					{
						label: '威士忌',
						key: 'whisky'
					}
				]
			},
			{
				label: '食物',
				key: 'food',
				children: [
					{
						label: '三明治',
						key: 'sandwich'
					}
				]
			},
			{
				label: '过去增多，未来减少',
				key: 'the-past-increases-the-future-recedes'
			}
		]
	}
]

</script>

<style scoped lang="less">

</style>
