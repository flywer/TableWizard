<template>
	ModelOverview
	{{projectId}}
	{{ panel}}
</template>

<script setup lang="ts">
import {ModelTabPanel} from "@render/stores/useProjectPage";
import {PropType} from "vue";

const props = defineProps({
	projectId: {
		type: Number,
		required: true,
	},
	panel: {
		type: Object as PropType<ModelTabPanel>,
		required: true,
	}
})
</script>

<style scoped lang="less">

</style>
