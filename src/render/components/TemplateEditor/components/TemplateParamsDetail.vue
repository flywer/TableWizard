<template>
	<MonacoEditor
		:code="JSON.stringify(params, null, 2)"
		language="json"
		height="300px"
		:font-size="12"
	/>
</template>

<script setup lang="ts">
import MonacoEditor from "@render/components/MonacoEditor/MonacoEditor.vue";
import {ref} from "vue";

const params = ref({
	tableName: 'table_name',
	tableComment: 'table_comment',
	fields: [
		{
			id: '1',
			fieldName: 'id',
			fieldComment: '主键ID',
			primaryKey: true,
			notNull: true,
			autoIncrement: true,
			type: 'INT',
			length: 10,
			scale: 0,
			defaultValue: null,
			hideInGraph: false
		}
	],
	config: {
		fieldUnderline: true,
		toUpperCase: false
	}
})


</script>

<style scoped lang="less">

</style>
