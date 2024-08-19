<template>
	<n-flex class="w-full mt-1" justify="start" vertical :size="0">
		<n-button
			type="primary"
			dashed
			@click="createNewOne({ option: menuOption, checked: false, selected: undefined })"
		>
			<template #icon>
				<div class="i-material-symbols:add-rounded"/>
			</template>
			新 建
		</n-button>
	</n-flex>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {GroupMenuOption} from "@render/components/GroupMenu/types";

const props = defineProps({
	menuOption: Object as PropType<GroupMenuOption>,
	createNewOne: {
		type: Function as PropType<({option, checked, selected}: {
			option: GroupMenuOption,
			checked: boolean,
			selected: boolean
		}) => void>,
		default: undefined,
	},
})

</script>

<style scoped lang="less">

</style>
