<template>
	<div class="relative">
	<div class="modified-marker">

	</div>

	</div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="less">
:deep(.modified-marker) {
	width: 4px;
	height: 85%;
	background-color: #eaea06;
	position: absolute;
	left: -40px; /* 微调位置到表格左侧 */
	top: 2px;
}

:deep(.row-index) {
	width: 34px;
	height: 100%;
	position: absolute;
	left: -34px; /* 微调位置到表格左侧 */
	top: 2px;
}
</style>
