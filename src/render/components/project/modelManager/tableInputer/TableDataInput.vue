<template>
	<div id="table-data-editor">
		<n-input
			:status="validation?.status"
			:size="size"
			v-model:value="inputValue"
			placeholder=""
			:class="className"
			@update:value="handleUpdateValue"
		>
			<template #suffix>
				<n-tooltip v-if="validation.status" trigger="hover" class="select-none">
					<template #trigger>
						<div class="i-material-symbols:brightness-alert-outline-rounded w-4 h-4"/>
					</template>
					{{ validation.message }}
				</n-tooltip>
			</template>
		</n-input>
	</div>
</template>

<script setup lang="ts">
import {PropType, ref, watch} from "vue";
import {useVModel} from "@vueuse/core";

const props = defineProps({
	value: String as PropType<string>,
	size: String as PropType<'small' | 'medium' | 'large'>,
	className: String,
	validation: {
		type: Object as PropType<{ message: string; status: 'success' | 'error' | 'warning' | undefined }>,
		required: false,
		default: undefined
	}
})

// 定义 emit，将选中的值传递给父组件
const emit = defineEmits(['update:value']);

const data = useVModel(props, 'value', emit)

// 内部值，用于双向绑定
const inputValue = ref('');

watch(() => props.value, (value) => {
	inputValue.value = value
})

const handleUpdateValue = (value: string) => {
	data.value = value
}

</script>

<style scoped lang="less">
#table-data-editor:deep(.n-input) {
	border-radius: 0;
	height: 100%;
}

#table-data-editor:deep(.n-input-wrapper) {
	line-height: 34px;
}
</style>
