<template>
	<n-card :bordered="false" size="small" class="mb-1 select-none pl-2 pr-4" :content-style="{padding:'4px'}">
		<n-flex justify="end">
			<n-button type="primary" @click="handleSave">
				保 存
			</n-button>
		</n-flex>
	</n-card>
	<n-scrollbar style="height: calc(100vh - 125px - 42px)">
		<div class="pr-4">
			<n-card size="small" class="mb-1 select-none" :content-style="{padding:'4px'}">
				<n-h5 prefix="bar">数据表信息</n-h5>
				<n-form
					ref="formRef"
					:model="useModelManager.getModelData(projectId,modelId)"
					:rules="formRules"
					:size="'small'"
				>
					<n-grid :cols="2" :x-gap="4">
						<n-form-item-gi label="表名称" path="tableName">
							<n-input v-model:value="useModelManager.getModelData(projectId,modelId).tableName" placeholder="表名称"
											 size="small"/>
						</n-form-item-gi>
						<n-form-item-gi label="表注释" path="tableComment">
							<n-input v-model:value="useModelManager.getModelData(projectId,modelId).tableComment" placeholder="表注释"
											 size="small"/>
						</n-form-item-gi>
					</n-grid>
				</n-form>
			</n-card>

			<n-card size="small" class="mb-1 select-none" :content-style="{padding:'4px'}">
				<template #default>
					<n-flex :size="'small'" justify="space-between">
						<n-flex class="items-center justify-center h-full" :size="0">
							<component
								:is="tableButton({
									iconClassName: 'i-material-symbols:add-rounded',
									onClick: () =>handleAddRow()
								})"/>
							<component
								:is="tableButton({
									iconClassName: 'i-material-symbols:check-indeterminate-small-rounded',
									disabled: fields.length === 0,
									onClick: () =>handleRemoveRow()
								})"/>
							<n-divider vertical/>
							<component
								:is="tableButton({
									iconClassName: 'i-material-symbols:vertical-align-top-rounded',
									onClick: () =>handleTopRow()
								})"/>
							<component
								:is="tableButton({
									iconClassName: 'i-material-symbols:arrow-upward-rounded',
									onClick: () =>handleUpwardRow()
								})"/>
							<component
								:is="tableButton({
									iconClassName: 'i-material-symbols:arrow-downward-rounded',
									onClick: () =>handleDownwardRow()
								})"/>
							<component
								:is="tableButton({
									iconClassName: 'i-material-symbols:vertical-align-bottom-rounded',
									onClick: () =>handleBottomRow()
								})"/>
							<n-divider vertical/>
							<component
								:is="tableButton({
									iconClassName: 'i-material-symbols:undo-rounded',
									disabled:!canUndo || history.length <= 2,
									onClick: () =>undo()
								})"/>
							<component
								:is="tableButton({
									iconClassName: 'i-material-symbols:redo-rounded',
									disabled:!canRedo,
									onClick: () =>redo()
								})"/>
						</n-flex>

						<n-flex class="items-center justify-center h-full" :size="0">

						</n-flex>

					</n-flex>
				</template>
			</n-card>

			<n-data-table
				id="field-table"
				v-model:checked-row-keys="checkedRowKeys"
				:bordered="true"
				:single-line="false"
				:size="'small'"
				:columns="columns"
				:data="fields"
				:max-height="550"
				:scroll-x="1500"
				:row-key="row => row.id"
				@update:checked-row-keys="handleCheckedRowKeys"
			/>
<!--			{{ history }}
			{{ modelOptions }}
			<pre>{{ JSON.stringify(fields, null, 2) }}</pre>-->
		</div>
	</n-scrollbar>
</template>

<script setup lang="ts">
import {computed, h, onMounted, PropType, reactive, ref, watch} from "vue";
import {DataTableColumns, FormInst, NButton, NCheckbox, NFlex, NInput, NText, useThemeVars} from "naive-ui";
import {v4 as uuidv4} from 'uuid';
import TableSelect from "@render/components/project/modelManager/tableInputer/TableSelect.vue";
import {useRefHistory} from "@vueuse/core";
import {ModelOptions, useModelManagerStore} from "@render/stores/useModelManager";
import TableDataInput from "@render/components/project/modelManager/tableInputer/TableDataInput.vue";
import TableDataNumberInput from "@render/components/project/modelManager/tableInputer/TableDataNumberInput.vue";
import {ModelApi} from "@render/api/ModelApi";
import {cloneDeep} from "lodash-es";

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

const useModelManager = useModelManagerStore()

const modelId = computed(() => props.modelOptions.id)

const formRef = ref<FormInst | null>(null);

const formModel = computed(() => useModelManager.getModelData(props.projectId, modelId.value))

const fields = ref<EntityField[]>([])

const formRules = reactive({
	tableName: {
		required: true,
		trigger: ['input'],
		message: '表名不能为空'
	}
})

const checkedRowKeys = ref([])

// 定义一个包含所有参数的对象类型
type TableButtonOptions = {
	iconClassName: string;
	onClick: () => void;
	disabled?: boolean;  // 可选参数，默认为 false
};

const tableButton = ({iconClassName, onClick, disabled = false}: TableButtonOptions) => {
	return h(NButton, {size: 'tiny', disabled: disabled, quaternary: true, onClick}, {
		default: () => h('div', {class: iconClassName + ' text-18px'})
	})
}

const fieldInit = () => {
	return {
		id: uuidv4(),
		fieldName: '',
		fieldComment: '',
		type: 'varchar',
		length: 255,
		scale: null,
		primaryKey: false,
		notNull: false,
		defaultValue: null,
		autoIncrement: false,
		hideInGraph: false
	}
}

const {history, undo, redo, canUndo, canRedo} = useRefHistory(fields, {capacity: 100, deep: true, clone: cloneDeep})

const fieldNameRepeatIds = ref([])
const fieldNameRepeatIdList = computed(() => {
	return checkFieldNameRepeat(fields.value)
})

const commonTableHeader = (title: string) => {
	return h(NFlex, {justify: 'center'}, () => [
		h(NText, {depth: 2, class: 'text-xs select-none'}, () => title),
	])
}

const checkedBackgroundClass = (row: EntityField) => {
	const color = useThemeVars().value.primaryColorPressed
	return checkedRowKeys.value?.at(0) == row.id ? `bg-[#EAFFF2FF]` : ''
}

const createColumns = (): DataTableColumns<EntityField> => [
	{
		multiple: false,
		type: 'selection',
		className: 'selection-column',
	},
	{
		key: 'fieldName',
		title() {
			return commonTableHeader('字段名称')
		},
		render(row, index) {
			return h("div", {style: {position: "relative"}}, [
				h("div", {class: "modified-marker"}),
				h(NText, {class: "row-index pl-3 " + checkedBackgroundClass(row)}, () => index + 1),
				h(TableDataInput, {
					value: row.fieldName,
					size: "small",
					validation: () => {
						return new Promise((resolve) => {
							if (fieldNameRepeatIdList.value.includes(row.id)) {
								resolve({message: "字段名称不能重复", status: 'error'})
							}
							resolve({message: "", status: undefined})
						})
					},
					className: checkedBackgroundClass(row),
					'onUpdate:value': (v: string) => {
						fields.value[index].fieldName = v;
					}
				}),
			])
		}
	},
	{
		title: '显示名称',
		key: 'fieldComment',
		render(row, index) {
			return h(TableDataInput, {
				value: row.fieldComment,
				size: "small",
				className: checkedBackgroundClass(row),
				'onUpdate:value': (v: string) => {
					fields.value[index].fieldComment = v;
				}
			})
		}
	},
	{
		title: '主键',
		key: 'primaryKey',
		width: 60,
		align: 'center',
		render(row, index) {
			return h(NCheckbox, {
				checked: row.primaryKey,
				size: 'small',
				onUpdateChecked(v) {
					fields.value[index].primaryKey = v
				}
			})
		}
	},
	{
		title: '不为空',
		key: 'notNull',
		width: 60,
		align: 'center',
		render(row, index) {
			return h(NCheckbox, {
				checked: row.notNull,
				size: 'small',
				onUpdateChecked(v) {
					fields.value[index].notNull = v
				}
			})
		}
	},
	{
		title: '自增',
		key: 'autoIncrement',
		width: 60,
		align: 'center',
		render(row, index) {
			return h(NCheckbox, {
				checked: row.autoIncrement,
				size: 'small',
				onUpdateChecked(v) {
					fields.value[index].autoIncrement = v
				}
			})
		}
	},
	{
		title: '字段类型',
		key: 'type',
		render(row, index) {
			return h(TableSelect, {
				value: row.type,
				options: [
					{label: 'int', value: 'int'},
					{label: 'varchar', value: 'varchar'},
					{label: 'decimal', value: 'decimal'},
					{label: 'datetime', value: 'datetime'},
					{label: 'text', value: 'text'},
					{label: 'json', value: 'json'},
				],
				size: 'small',
				'onUpdate:value': (v: string) => {
					fields.value[index].type = v
				}
			})
		}
	},
	{
		title: '长度',
		key: 'length',
		render(row, index) {
			return h(TableDataNumberInput, {
				value: row.length,
				size: 'small',
				'onUpdate:value': (v: number) => {
					fields.value[index].length = v
				},
			})
		}
	},
	{
		title: '小数位数',
		key: 'scale',
		render(row, index) {
			return h(TableDataNumberInput, {
				value: row.scale,
				size: 'small',
				'onUpdate:value': (v: number) => {
					fields.value[index].scale = v
				}
			})
		}
	},
	{
		title: '默认值',
		key: 'defaultValue',
		render(row, index) {
			return h(TableDataInput, {
				value: row.defaultValue,
				size: "small",
				className: checkedBackgroundClass(row),
				'onUpdate:value': (v: string) => {
					fields.value[index].defaultValue = v;
				}
			})
		}
	},
]

const columns = ref(createColumns())

const handleCheckedRowKeys = (keys: Array<string | number>, rows: object[], meta: {
	row: object | undefined,
	action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
}) => {
	console.log(keys, rows, meta)
}

const handleAddRow = () => {
	// 判断当前是否选择了行
	if (checkedRowKeys.value.length === 0) {
		fields.value.push(fieldInit())
	} else {
		const index = fields.value.findIndex(row => row.id === checkedRowKeys.value[0])
		fields.value.splice(index + 1, 0, fieldInit())
	}
}

const handleRemoveRow = () => {
	// 判断当前是否选择了行
	if (checkedRowKeys.value.length === 0) {
		return
	}
	const index = fields.value.findIndex(row => row.id === checkedRowKeys.value[0])
	fields.value.splice(index, 1)
}

const handleTopRow = () => {
	// 判断当前是否选择了行
	if (checkedRowKeys.value.length === 0) {
		return
	}
	const index = fields.value.findIndex(row => row.id === checkedRowKeys.value[0])
	if (index === 0) {
		return
	}
	const row = fields.value.splice(index, 1)
	// 将当前行移动到第一行
	fields.value.unshift(row[0])
}

const handleUpwardRow = () => {
	// 判断当前是否选择了行
	if (checkedRowKeys.value.length === 0) {
		return
	}
	const index = fields.value.findIndex(row => row.id === checkedRowKeys.value[0])
	if (index === 0) {
		return
	}
	const row = fields.value.splice(index, 1)
	// 将当前行移动到上一行
	fields.value.splice(index - 1, 0, row[0])
}

const handleDownwardRow = () => {
	// 判断当前是否选择了行
	if (checkedRowKeys.value.length === 0) {
		return
	}
	const index = fields.value.findIndex(row => row.id === checkedRowKeys.value[0])
	if (index === fields.value.length - 1) {
		return
	}
	const row = fields.value.splice(index, 1)
	// 将当前行移动到下一行
	fields.value.splice(index + 1, 0, row[0])
}

const handleBottomRow = () => {
	// 判断当前是否选择了行
	if (checkedRowKeys.value.length === 0) {
		return
	}
	const index = fields.value.findIndex(row => row.id === checkedRowKeys.value[0])
	if (index === fields.value.length - 1) {
		return
	}
	const row = fields.value.splice(index, 1)
	// 将当前行移动到最后一行
	fields.value.push(row[0])
}

/**
 * 校验fieldName是否存在重复，若有则返回这些行的id
 **/
const checkFieldNameRepeat = (fields: EntityField[]) => {
	const validFields = fields.filter(row => row.id && row.fieldName)
	const fieldNameMap = new Map<string, string>()
	const repeatIds: string[] = []
	validFields.forEach(row => {
		if (fieldNameMap.has(row.fieldName)) {
			repeatIds.push(row.id)
		} else {
			fieldNameMap.set(row.fieldName, row.id)
		}
	})
	return repeatIds
}

const handleSave = () => {
	formRef.value?.validate().then(() => {
		const validFields = fields.value.filter(row => row.id && row.fieldName)

		const vo: SaveDataTableVO = {
			id: props.modelOptions.id,
			projectId: props.projectId,
			parentId: props.modelOptions.parentId,
			tableName: formModel.value.tableName,
			tableComment: formModel.value.tableComment,
			fields: validFields
		}
		ModelApi.saveDatatable(vo).then(() => {
			window.$message.success('保存成功')
			useModelManager.menuOptionInit(props.projectId)
			useModelManager.updateTabPanelLabel(props.projectId, props.modelOptions.id, formModel.value.tableName)
		})
	})
}

watch(fields, (value, oldValue) => {
	console.log(value, oldValue)
	if (value) {
		useModelManager.updateModelDataFields(props.projectId, modelId.value, value)
	}

}, {deep: true})

/*watch(() => useModelManager.getModelData(props.projectId, modelId.value), (value) => {
	if (value) {
		console.log(value)
	}
}, {deep: true})*/

onMounted(async () => {
	if (!useModelManager.hasModelData(props.projectId, modelId.value)) {
		await useModelManager.setModelData(props.projectId, modelId.value)
	}
	fields.value = useModelManager.getModelData(props.projectId, modelId.value).fields
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
