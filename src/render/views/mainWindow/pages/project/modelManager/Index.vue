<template>
	数据模型
	{{route.query}}
	<n-flex vertical>
		<n-text depth="3">Main</n-text>
		<n-button @click="">产生一个通知</n-button>
	</n-flex>
</template>

<script setup lang="ts">
import {useAppNotificationStore} from "@render/stores/app/appNotification";
import {useRoute} from "vue-router";

defineOptions({name: 'ProjectModelManager'})

const route = useRoute()

const test = () => {
	useAppNotificationStore().addNotification({
		title: '测试title',
		content: '测试content',
		type: 'warning',
		duration: 2000
	})
}
</script>

<style scoped lang="less">

</style>
