<template>
	<n-button v-if="!isWindowTop" quaternary size="tiny" @click="windowPin">
		<template #icon>
			<div class="i-ph:push-pin-bold"/>
		</template>
	</n-button>
	<n-button v-else quaternary size="tiny" @click="windowPin">
		<template #icon>
			<div class="i-ph:push-pin-slash-bold"/>
		</template>
	</n-button>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {WindowApi} from "@render/api/app/WindowApi";

const isWindowTop = ref(false)

const windowPin = () => {
	isWindowTop.value = !isWindowTop.value
	WindowApi.windowTop(isWindowTop.value)
}

</script>

<style scoped lang="less">

</style>
