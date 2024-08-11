<template>
	<div class="fixed top-10 bottom-6 left-0 right-0">
		<router-view/>
	</div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="less">
#app-menu:deep(.n-menu-item) {
	height: 50px;
}

#app-menu:deep(.n-menu-item-content-header) {
	width: 48px;
	position: absolute;
	left: -14px;
	top: 4px;
}
</style>
