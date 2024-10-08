<template>
	<n-auto-complete
		id="table-data-editor"
		v-model:value="inputValue"
		:options="filteredOptions"
		:get-show="handleGetShow"
		@update:value="$emit('update:value', $event)"
	>
		<template #suffix>
			<div class="i-material-symbols:keyboard-arrow-down-rounded"/>
		</template>
	</n-auto-complete>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {isEmpty} from "lodash";

const props = defineProps<{
	value: string;
	options: { label: string; value: string }[];
}>();

// 定义 emit，将选中的值传递给父组件
defineEmits(['update:value']);

// 内部值，用于双向绑定
const inputValue = ref('');

// 计算属性，根据输入值过滤选项列表
const filteredOptions = computed(() => {
	return props.options.filter((item) =>
		item.label.toLowerCase().includes(inputValue.value.toLowerCase())
	);
});

const handleGetShow = (value: string) => {
	if (isEmpty(value)) {
		return true
	} else {
		// 存在于选项中
		return true
	}
}

// 监听 modelValue 的变化，更新内部值
watch(() => props.value, (newValue) => {
	inputValue.value = newValue;
});

onMounted(() => {
	inputValue.value = props.value;
});
</script>

<style scoped lang="less">
#table-data-editor {
	width: calc(100% + 1px);
}

#table-data-editor:deep(.n-input) {
	border-radius: 0;
	height: 36px;
}

#table-data-editor:deep(.n-input:not(.n-input--focus)) {
	background: transparent;
}

#table-data-editor:deep(.n-input-wrapper) {
	line-height: 34px;
}
</style>
