<template>
	<n-split
		v-model:size="splitSize"
		class="h-full"
		direction="horizontal"
		max="300px"
		default-size="200px"
	>
		<template #1>
			<ModelTree/>
		</template>
		<template #2>
			数据模型
			{{ route.query }}
			<n-flex vertical>
				<n-text depth="3">Main</n-text>
				<n-button @click="">产生一个通知</n-button>
			</n-flex>
		</template>
	</n-split>
</template>

<script setup lang="ts">
import {useAppNotificationStore} from "@render/stores/app/appNotification";
import {useRoute} from "vue-router";
import {computed, onMounted, ref, watch} from "vue";
import {useProjectPageStore} from "@render/stores/useProjectPage";
import ModelTree from "@render/components/project/modelManager/ModelManagerMenu.vue";

defineOptions({name: 'ProjectModelManager'})

const route = useRoute()
const projectId = computed(() => parseInt(route.query.projectId as string))
const useProjectPage = useProjectPageStore()
const splitSize = ref()

const test = () => {
	useAppNotificationStore().addNotification({
		title: '测试title',
		content: '测试content',
		type: 'warning',
		duration: 2000
	})
}

watch(projectId, (value) => {
	splitSize.value = useProjectPage.getSplitSize(value)
})

watch(splitSize, (value) => {
	useProjectPage.updateSplitSize(projectId.value, value)
})

onMounted(() => {
	splitSize.value = useProjectPage.getSplitSize(projectId.value)
})


</script>

<style scoped lang="less">

</style>
