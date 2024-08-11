<template>
	<n-flex class="window-btn pt-1.5 pb-1 pr-1" justify="center" :size="0" :wrap="false">
		<TopMoreMenuButton class="w-8 h-7 common-btn"/>
		<PushPinButton class="w-8 h-7 common-btn"/>
		<n-button quaternary size="tiny" class="w-8 h-7 common-btn" @click="WindowApi.windowMinimize()">
			<template #icon>
				<div class="i-mingcute:minimize-line"/>
			</template>
		</n-button>
		<n-button quaternary size="tiny" class="w-8 h-7 common-btn" @click="WindowApi.windowMaximize()">
			<template #icon>
				<div class="i-material-symbols:chrome-maximize-outline"/>
			</template>
		</n-button>
		<n-button quaternary size="tiny" class="w-8 h-7 close-btn" @click="WindowApi.windowClose()">
			<template #icon>
				<div class="i-material-symbols:close-rounded close-icon"/>
			</template>
		</n-button>
	</n-flex>
</template>

<script setup lang="ts">
import {WindowApi} from "@render/api/app/WindowApi";
import PushPinButton from "@render/components/TopButtonBar/button/PushPinButton.vue";
import TopMoreMenuButton from "@render/components/TopButtonBar/button/TopMoreMenuButton.vue";

defineOptions({name: 'TopButtonBar'})
</script>

<style scoped lang="less">
.window-btn {
	-webkit-app-region: no-drag;
	/*background-color: transparent;*/
}

.common-btn:hover {
	color: var(--n-text-clor);
}

.common-btn:focus {
	color: var(--n-text-clor);
}

//关闭窗口按钮 动画特殊
.close-btn:hover {
	background-color: rgba(241, 70, 70, 0.66);

	.close-icon {
		color: white;
	}
}
</style>
