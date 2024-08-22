<template>
	<div>
		<n-tabs
			v-model:value="activeTab"
			type="line"
			:size="'small'"
			:animated="true"
			:placement="'left'"
		>
			<n-tab-pane
				v-for="dialect in databaseDialects"
				:key="dialect.value"
				:name="dialect.value"
				:tab="dialect.label"
			>
				<template #default>
					<n-flex vertical :size="2">
						<n-card :bordered="false" size="small" class="mb-1 select-none" :content-style="{padding:'4px'}">
							<n-flex :size="'small'" justify="space-between">
								<n-flex class="items-center justify-center h-full" :size="0">
									<n-button :size="'small'" dashed>编辑模板</n-button>
								</n-flex>
								<n-button>设置</n-button>
							</n-flex>
						</n-card>
						<n-divider style="margin: 0"/>
						<MonacoEditor
							v-model:code="ddlValue"
							:language="activeTab"
							height="calc(100vh - 222px)"
						/>
					</n-flex>
				</template>
			</n-tab-pane>
		</n-tabs>
	</div>
</template>

<script setup lang="ts">
import {onMounted, PropType, reactive, ref, watch} from "vue";
import {NFlex} from "naive-ui";
import MonacoEditor from "@render/components/MonacoEditor/MonacoEditor.vue";
import Handlebars from "handlebars";
import {TemplateApi} from "@render/api/TemplateApi";

const props = defineProps({
	projectId: Number,
	datatable: {
		type: Object as PropType<{ tableName: string, tableComment: string, fields: EntityField[] }>,
		required: true
	}
})

const activeTab = ref('mysql')
const ddlValue = ref()

const databaseDialects = reactive([
	{
		label: 'MySQL',
		value: 'mysql'
	},
	{
		label: 'PostgreSQL',
		value: 'postgresql'
	},
	{
		label: 'Oracle',
		value: 'oracle'
	},
	{
		label: 'SQL Server',
		value: 'sqlserver'
	},
	{
		label: 'SQLite',
		value: 'sqlite'
	}
])

const handleCompile = () => {
	const params = {
		tableName: props.datatable.tableName,
		tableComment: props.datatable.tableComment,
		fields: props.datatable.fields,
		config: {
			fieldCamelBar: true,
			toUpperCase: true
		}
	}
	TemplateApi.getTemplate(props.projectId, activeTab.value).then(res => {
		if (res) {
			const template = Handlebars.compile(res);
			ddlValue.value = template(params);
		}
	})
}

// 数据发生变化
watch(() => props.datatable, () => {
	console.log(props.datatable)
	handleCompile()
})

// 方言发生变化
watch(() => activeTab.value, () => {
	console.log(props.datatable)
	handleCompile()
})

onMounted(() => {
	console.log(props.datatable)
	handleCompile()
})

</script>

<style scoped lang="less">

</style>
