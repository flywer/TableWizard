<template>
	<n-flex align="center">
		<n-text v-text="label"/>
	</n-flex>
</template>

<script setup lang="ts">
defineProps<{
	label: string
}>()
</script>

<style scoped lang="less">

</style>
