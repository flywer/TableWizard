<template>
	<n-flex  justify="center" align="center"  style="height: 36px">
		<n-checkbox
			v-model:checked="checkedValue"
			:size="size"
			@update:checked="$emit('update:checked', $event)"
		/>
	</n-flex>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";

const props = defineProps<{
	checked: boolean;
	size: 'small' | 'medium' | 'large';
}>();

// 定义 emit，将选中的值传递给父组件
const emit = defineEmits(['update:checked']);

const checkedValue = ref(false);

watch(() => props.checked, (value) => {
	checkedValue.value = value
})


onMounted(() => {
	checkedValue.value = props.checked
})

</script>

<style scoped lang="less">

</style>
