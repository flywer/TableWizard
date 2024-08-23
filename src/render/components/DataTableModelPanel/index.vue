<template>
	<div id="model-panel">
		<n-tabs
			default-value="1"
			type="line"
			add-tab-class="pl-4"
			tabs-padding="20"
		>
			<n-tab-pane name="1" tab="表信息">
				<ModelTableEditor
					:project-id="projectId"
					:model-options="modelOptions"
				/>
			</n-tab-pane>
			<n-tab-pane name="2" tab="数据库语句">
				<DDLGenerator
					:project-id="projectId"
					:model-id="modelOptions.id"
				/>
			</n-tab-pane>
			<template #suffix>
				Suffix
			</template>
		</n-tabs>
	</div>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {ModelOptions} from "@render/stores/useModelManager";
import DDLGenerator from "@render/components/DataTableModelPanel/DDLGenerator.vue";
import ModelTableEditor from "@render/components/DataTableModelPanel/ModelTableEditor.vue";

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
#field-table:deep(.n-data-table-td) {
	padding: 0;
}

#field-table:deep(.selection-column .n-radio) {
	width: 35px;
	margin-left: 5px;
}

#field-table:deep(.selection-column .n-radio__dot) {
	border: none;
	appearance: none;
	box-shadow: none;
	background: transparent;

	display: none;

	::before {
		background: transparent;
	}
}

#field-table:deep(.modified-marker) {
	width: 4px;
	height: 85%;
	background-color: #d09966;
	position: absolute;
	left: -40px; /* 微调位置到表格左侧 */
	top: 2px;
}

#field-table:deep(.row-index) {
	width: 34px;
	height: 100%;
	position: absolute;
	left: -34px; /* 微调位置到表格左侧 */
	top: 2px;
}

</style>
