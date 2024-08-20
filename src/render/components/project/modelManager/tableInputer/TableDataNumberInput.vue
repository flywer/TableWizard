<template>
	<div id="table-data-editor">
			<n-input-number
				v-model:value="inputValue"
				:status="validation?.status"
				:size="size"
				:show-button="false"
				placeholder=""
				:class="className"
				@update:value="handleUpdateValue"
			>
				<template #suffix>
					<n-tooltip v-if="validation?.status" trigger="hover" class="select-none">
						<template #trigger>
							<div class="i-material-symbols:brightness-alert-outline-rounded w-4 h-4"/>
						</template>
						{{ validation?.message }}
					</n-tooltip>
				</template>
			</n-input-number>
	</div>
</template>

<script setup lang="ts">
import {onMounted, PropType, ref, watch} from "vue";
import {useVModel} from "@vueuse/core";

const props = defineProps({
	value: Number as PropType<number>,
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
const inputValue = ref();

const handleUpdateValue = (value: number) => {
	data.value = value
}

watch(() => props.value, (value) => {
	inputValue.value = value
})

onMounted(()=>{
	inputValue.value = props.value
})
</script>

<style scoped lang="less">
#table-data-editor {
  width: calc(100% + 1px);
}

#table-data-editor:deep(.n-input) {
	border-radius: 0;
	height: 36px;
}

#table-data-editor:deep(.n-input-wrapper) {
	line-height: 34px;
}
</style>
