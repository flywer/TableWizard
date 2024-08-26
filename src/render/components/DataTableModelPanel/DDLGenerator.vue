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
							id="dialect-menu"
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
								<n-button :size="'small'" dashed @click="handleEditTemplate">编辑模板</n-button>
								<n-button :size="'small'" dashed>文本复制</n-button>
							</n-flex>
							<n-button :size="'small'" dashed>编辑器设置</n-button>
						</n-flex>
					</n-card>
					<n-divider style="margin: 0"/>
					<MonacoEditor
						v-model:code="editorValue"
						language="commonsql"
						height="calc(100vh - 222px)"
					/>
				</n-flex>
				<n-spin v-else>
				</n-spin>
			</n-layout>
		</n-layout>
		<TemplateEditorModal
			v-model:show="templateEditorModalCfg.show"
			v-model:save-flag="templateEditorModalCfg.saveFlag"
			:title="templateEditorModalCfg.title"
			:project-id="projectId"
			:dialect="dialect"
			:template-type="templateType"
			:compile-params="compileParams"
		/>
	</div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from "vue";
import {MenuOption, NFlex} from "naive-ui";
import Handlebars from "handlebars";
import {TemplateApi} from "@render/api/TemplateApi";
import MonacoEditor from "@render/components/MonacoEditor/MonacoEditor.vue";
import {isEmpty} from "lodash-es";
import {useModelManagerStore} from "@render/stores/useModelManager";
import TemplateEditorModal from "@render/components/TemplateEditor/TemplateEditorModal.vue";

const props = defineProps({
	projectId: Number,
	modelId: String
})

const useModelManager = useModelManagerStore()

const dialectMenuOptions = ref<MenuOption[]>([])

const menuActiveKey = ref<string | null>(null)

const editorValue = ref()

const dialect = computed(() => menuActiveKey.value?.split('-')[0] || 'mysql')
const templateType = computed(() => menuActiveKey.value?.split('-')[1] || 'createTable')

const templateEditorModalCfg = reactive({
	show: false,
	title: '编辑模板',
	saveFlag: false
})

const compileParams = ref<TemplateCompileParams>()

const dialectMenuInit = async () => {
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

const handleCompile = () => {

	const modelData = useModelManager.getModelData(props.projectId, props.modelId)

	modelData.fields = modelData.fields.filter(item => item.fieldName)

	compileParams.value = {
		tableName: modelData.tableName,
		tableComment: modelData.tableComment,
		fields: modelData.fields,
		config: {
			fieldUnderline: true,
			toUpperCase: true
		}
	}
	TemplateApi.getTemplate(props.projectId, dialect.value, templateType.value).then(res => {
		if (res) {
			const template = Handlebars.compile(res);
			editorValue.value = template(compileParams.value);
		}
	})
}

const handleEditTemplate = () => {
	templateEditorModalCfg.show = true
	templateEditorModalCfg.saveFlag = false
}

// 数据发生变化
watch(() => useModelManager.getModelData(props.projectId, props.modelId), () => {
	handleCompile()
})

onMounted(() => {
	dialectMenuInit()
	handleCompile()
})

</script>

<style scoped lang="less">
#dialect-menu:deep(.n-menu-item) {
	height: 32px;
}

#dialect-menu:deep(.n-menu-item-content) {
	height: 32px;
}
</style>
