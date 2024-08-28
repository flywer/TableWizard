<template>
	<n-modal
		v-model:show="_show"
		:title="title"
		preset="card"
		:mask-closable="false"
		:closable="true"
		:size="'small'"
		style="width: 85%"
		:segmented="{content: true}"
		:content-style="{padding: '0'}"
	>
		<template #header>
			<n-text class="select-none">{{ title }}</n-text>
		</template>
		<template #default>
			<n-scrollbar style="height: calc(100vh - 300px)">
				<n-split
					min="200px"
					max="1000px"
					default-size="300px"
					style="height: calc(100vh - 300px)"
				>
					<template #1>
						<n-scrollbar style="height: calc(100vh - 300px)">
							<n-collapse class="p-4">
								<n-collapse-item title="模板参数定义" name="1">
									<template #header>
										<n-text class="select-none">模板参数定义</n-text>
									</template>
									<TemplateParamsDetail/>
								</n-collapse-item>
								<n-collapse-item name="2">
									<template #header>
										<n-text class="select-none">Handlebars语法</n-text>
									</template>
									<HandlebarsSyntaxTable/>
								</n-collapse-item>
								<n-collapse-item title="内置方法" name="3">
									<template #header>
										<n-text class="select-none">内置方法</n-text>
									</template>
									<template #header-extra>
									</template>
									<BuiltInHelperTable/>
								</n-collapse-item>
							</n-collapse>
						</n-scrollbar>
					</template>
					<template #2>
						<n-split
							direction="vertical"
							style="height: 100%"
							min="160px"
							max="1000px"
						>
							<template #1>
								<n-flex vertical class="h-full" :size="0">
									<n-card :bordered="false" size="small" class="mb-1 select-none h-32px"
													:content-style="{padding:'4px'}">
										<n-flex class="items-center justify-center h-full" :size="4">
											<n-button :size="'small'" dashed @click="">重置为默认模板</n-button>
										</n-flex>
									</n-card>
									<MonacoEditor
										v-model:code="templateValue"
										language="handlebars"
										:style="errorMessage ? {height: `calc(100% - ${errorAlertHeight}px - 32px)`} : {height: 'calc(100% - 32px)'}"
										@update:code="handleUpdateTemplate"
									/>
									<n-alert
										ref="errorAlert"
										v-if="errorMessage"
										type="error"
										:bordered="false"
									>
										<span class="text-12px">{{ errorMessage }}</span>
									</n-alert>
								</n-flex>
							</template>
							<template #2>
								<MonacoEditor
									v-model:code="compiledValue"
									language="commonsql"
									style="height: 100%"
								/>
							</template>
						</n-split>
					</template>
				</n-split>
			</n-scrollbar>
		</template>

		<template #action>
			<n-flex :justify="'end'">
				<n-button type="primary" :size="'small'" @click="" :loading="false">保存</n-button>
			</n-flex>
		</template>
	</n-modal>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {TemplateApi} from "@render/api/TemplateApi";
import MonacoEditor from "@render/components/MonacoEditor/MonacoEditor.vue";
import Handlebars from "handlebars";
import HandlebarsSyntaxTable from "@render/components/TemplateEditor/components/HandlebarsSyntaxTable.vue";
import TemplateParamsDetail from "@render/components/TemplateEditor/components/TemplateParamsDetail.vue";
import BuiltInHelperTable from "@render/components/TemplateEditor/components/BuiltInHelperTable.vue";
import {useElementSize} from "@vueuse/core";
import {NFlex} from "naive-ui";

const props = defineProps({
	show: {
		type: Boolean,
		required: true,
		default: false
	},
	title: {
		type: String,
		default: ''
	},
	saveFlag: {
		type: Boolean,
		required: true,
		default: false
	},
	projectId: {
		type: Number,
		required: true
	},
	dialect: {
		type: String,
		required: true
	},
	templateType: {
		type: String,
		required: true
	},
	compileParams: {
		type: Object,
		required: true
	}
})

const emit = defineEmits(['update:show', 'update:saveFlag'])
const _show = ref(false)

watch(() => props.show, async (v) => {
	if (v) {
		templateInit()
	}
	_show.value = v
})

watch(_show, async (v) => {
	emit('update:show', v)
})

// 模板值
const templateValue = ref()
// 编译值
const compiledValue = ref()

const hasError = ref(false)
const errorMessage = ref('')

const errorAlert = ref()
const {height: errorAlertHeight} = useElementSize(errorAlert)

const templateInit = () => {
	TemplateApi.getTemplate(props.projectId, props.dialect, props.templateType).then(res => {
		templateValue.value = res

		const template = Handlebars.compile(res);
		compiledValue.value = template(props.compileParams);
	})
}

const handleUpdateTemplate = (value: string) => {
	try {
		hasError.value = false
		const template = Handlebars.compile(value);
		compiledValue.value = template(props.compileParams);
		errorMessage.value = null
	} catch (e) {
		hasError.value = true
		errorMessage.value = e.message
	}
}

</script>

<style scoped lang="less">

</style>
