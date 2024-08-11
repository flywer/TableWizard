<template>
	<div
		id="app-bar"
		class="w-screen fixed top-0 left-0 h-10 z-5000"
		:style="{backgroundColor:useThemeVars().value.dividerColor}"
	>

		<div class="absolute top-0 left-2">
		<n-flex class="pt-1.5">
				<img src="@render/assets/logo.png" class="w-6">
		</n-flex>

		</div>
		<TopMenuBar class="absolute top-0 left-22 right-[260px]"/>
		<TopButtonBar class="absolute top-0 right-0 z-50"/>
	</div>
</template>

<script setup lang="ts">

import TopButtonBar from "@render/components/TopButtonBar/index.vue";
import TopMenuBar from "@render/components/TopMenuBar/index.vue";
import {useThemeVars} from "naive-ui";

// 顶部菜单栏
defineOptions({name: 'AppBar'})

</script>

<style scoped lang="less">
#app-bar {
	-webkit-app-region: drag; // 窗口拖动
}
</style>
