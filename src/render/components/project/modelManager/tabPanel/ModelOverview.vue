<template>
	ModelOverview
	{{ projectId }}
	{{ modelOptions }}
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {ModelOptions} from "@render/stores/useModelManager";

const props = defineProps({
	projectId: {
		type: Number,
		required: true,
	},
	modelOptions: {
		type: Object as PropType<ModelOptions>,
		required: true,
	}
})
</script>

<style scoped lang="less">

</style>
