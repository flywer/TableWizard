<template>
	<div>
		<n-layout has-sider>
			<n-layout-sider
				bordered
				:width="130"
			>
				<n-flex vertical>
					<n-scrollbar style="height:calc(100vh - 240px)">
						<n-menu
							v-model:value="menuActiveKey"
							:options="dialectMenuOptions"
							:indent="12"
							@update:value="handleUpdateMenu"
						/>
					</n-scrollbar>
					<n-divider class="pr-2" style="margin: 0 "/>
					<n-flex class="ml-1 mr-1" :size="4" justify="center" vertical>
						<n-button :size="'tiny'" dashed>
							<template #icon>
								<div class="i-material-symbols:add-rounded"/>
							</template>
							新增
						</n-button>
						<n-button :size="'tiny'" dashed>
							<template #icon>
								<div class="i-material-symbols:edit-rounded"/>
							</template>
							删除
						</n-button>
					</n-flex>
				</n-flex>
			</n-layout-sider>
			<n-layout>
				<n-flex vertical :size="2" v-if="!isEmpty(dialectMenuOptions) ">
					<n-card :bordered="false" size="small" class="mb-1 select-none" :content-style="{padding:'4px'}">
						<n-flex :size="'small'" justify="space-between">
							<n-flex class="items-center justify-center h-full" :size="4">
								<n-button :size="'small'" dashed>编辑模板</n-button>
								<n-button :size="'small'" dashed>文本复制</n-button>
							</n-flex>
							<n-button :size="'small'" dashed>编辑器设置</n-button>
						</n-flex>
					</n-card>
					<n-divider style="margin: 0"/>
					<MonacoEditor
						v-model:code="editorValue"
						:language="menuActiveKey.split('-')[0]"
						height="calc(100vh - 222px)"
					/>
				</n-flex>
				<n-spin v-else>
				</n-spin>
			</n-layout>
		</n-layout>
	</div>
</template>

<script setup lang="ts">
import {computed, onMounted, PropType, reactive, ref, watch} from "vue";
import {MenuOption, NFlex} from "naive-ui";
import Handlebars from "handlebars";
import {TemplateApi} from "@render/api/TemplateApi";
import MonacoEditor from "@render/components/MonacoEditor/MonacoEditor.vue";
import {isEmpty} from "lodash-es";

const props = defineProps({
	projectId: Number,
	datatable: {
		type: Object as PropType<{ tableName: string, tableComment: string, fields: EntityField[] }>,
		required: true
	}
})

const dialects = reactive<string[]>([])
const dialectMenuOptions = ref<MenuOption[]>([])

const menuActiveKey = ref<string | null>(null)

const editorValue = ref()

const dialect = computed(() => menuActiveKey.value?.split('-')[0] || 'mysql')
const templateType = computed(() => menuActiveKey.value?.split('-')[1] || 'createTable')

const getDialects = () => {
	dialects.push('mysql')
	dialects.push('postgresql')
	dialects.push('oracle')
	dialects.push('sqlserver')
	dialects.push('sqlite')
	dialects.push('sqlite')
	dialects.push('sqlite')
	dialects.push('sqlite')
	dialects.push('sqlite')
	dialects.push('sqlite')
	dialects.push('sqlite')
	dialects.push('sqlite')
	dialects.push('sqlite')
	dialects.push('sqlite')
	dialects.push('sqlite')
	dialects.push('sqlite')
	dialects.push('sqlite')
	dialects.push('sqlite')
}


const dialectMenuInit = async () => {
	getDialects()

	const dialectTemplates = await TemplateApi.getTemplates(props.projectId)

	dialectMenuOptions.value = dialectTemplates.map(item => {
		const childrenMenu = item.templates.map(template => {
			return {
				label: template.label,
				key: item.dialect + '-' + template.type
			}
		})

		return {
			label: item.dialect,
			key: item.dialect,
			children: childrenMenu
		}
	})

	menuActiveKey.value = dialectTemplates[0].dialect + '-createTable'
}

const handleUpdateMenu = () => {
	handleCompile()
}

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
	},
	{
		label: 'H2',
		value: 'h2'
	},
	{
		label: 'HSQL',
		value: 'hsqldb'
	},
	{
		label: 'DB2',
		value: 'db2'
	},
	{
		label: 'DM',
		value: 'dm'
	},
	{
		label: 'Kingbase',
		value: 'kingbase'
	},
	{
		label: 'Firebird',
		value: 'firebird'
	},
	{
		label: 'GBase',
		value: 'gbase'
	},
	{
		label: 'Informix',
		value: 'informix'
	},
	{
		label: 'MariaDB',
		value: 'mariadb'
	},
	{
		label: 'Oscar',
		value: 'oscar'
	},
	{
		label: 'Sybase',
		value: 'sybase'
	},
	{
		label: 'Xugu',
		value: 'xugu'
	},
	{
		label: 'Yugabyte',
		value: 'yugabyte'
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
	TemplateApi.getTemplate(props.projectId, dialect.value, templateType.value).then(res => {
		if (res) {
			const template = Handlebars.compile(res);
			editorValue.value = template(params);
		}
	})
}

// 数据发生变化
watch(() => props.datatable, () => {
	handleCompile()
})

onMounted(() => {
	dialectMenuInit()
	handleCompile()
})

</script>

<style scoped lang="less">

</style>
