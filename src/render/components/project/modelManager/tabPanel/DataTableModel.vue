<template>
	<div>
		<n-card :bordered="false" size="small" class="mb-1 select-none pl-2 pr-2" :content-style="{padding:'4px'}">
			<n-flex justify="end">
				<n-button type="primary">
					保 存
				</n-button>
			</n-flex>
		</n-card>
		<n-scrollbar style="height: calc(100vh - 125px - 42px)">
			<n-card size="small" class="mb-1 select-none" :content-style="{padding:'4px'}">
				<n-form
					ref="formRef"
					:model="formModel"
					:rules="formRules"
					:size="'small'"
				>
					<n-grid :cols="2" :x-gap="4">
						<n-form-item-gi label="表名称">
							<n-input v-model:value="formModel.tableName" placeholder="表名称" size="small"/>
						</n-form-item-gi>
						<n-form-item-gi label="表注释">
							<n-input v-model:value="formModel.tableComment" placeholder="表注释" size="small"/>
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
									disabled: data.length === 0,
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
									disabled:!canUndo,
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
				:bordered="false"
				:single-line="false"
				:size="'small'"
				:columns="columns"
				:data="data"
				:max-height="550"
				:scroll-x="1500"
				:row-key="row => row.id"
				@update:checked-row-keys="handleCheckedRowKeys"
			/>
			<pre>{{ JSON.stringify(data, null, 2) }}</pre>
		</n-scrollbar>
	</div>
</template>

<script setup lang="ts">
import {ModelTabPanel} from "@render/stores/useProjectPage";
import {h, onMounted, PropType, reactive, ref} from "vue";
import {
	DataTableColumns,
	FormInst,
	NButton,
	NCheckbox,
	NFlex,
	NInput,
	NInputNumber,
	NText,
	useThemeVars
} from "naive-ui";
import {v4 as uuidv4} from 'uuid';
import TableSelect from "@render/components/project/modelManager/tableInputer/TableSelect.vue";
import {useRefHistory} from "@vueuse/core";

const props = defineProps({
	projectId: {
		type: Number,
		required: true,
	},
	panel: {
		type: Object as PropType<ModelTabPanel>,
		required: true,
	}
})

const formRef = ref<FormInst | null>(null);
const formModel = reactive({
	tableName: null,
	tableComment: null,
	projectPath: null
})

const formRules = reactive({
	projectName: {
		required: true,
		trigger: ['input'],
		message: '项目名称不能为空'
	},
	projectPath: {
		required: true,
		trigger: ['input'],
		message: '项目路径不能为空'
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
		defKey: null,
		defName: null,
		type: '',
		length: null,
		scale: null,
		primaryKey: false,
		notNull: false,
		defaultValue: null,
		autoIncrement: false,
		hideInGraph: false
	}
}

const data = ref<EntityField[]>([])

const {history, undo, redo, canUndo, canRedo} = useRefHistory(data, {deep: true, capacity: 100})

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
		key: 'defKey',
		title() {
			return commonTableHeader('字段名称')
		},
		render(row, index) {
			return h("div", {style: {position: "relative"}}, [
				true ? h("div", {class: "modified-marker"}) : null,
				h(NText, {
					class: "row-index pl-3 " + checkedBackgroundClass(row),
					onClick: () => {
						console.log('2222')
					}
				}, () => index + 1),
				h(NInput, {
					value: row.defKey,
					size: "small",
					class: checkedBackgroundClass(row),
					onUpdateValue(v) {
						data.value[index].defKey = v;
					}
				})
			])
		}
	},
	{
		title: '显示名称',
		key: 'defName',
		render(row, index) {
			return h(NInput, {
				value: row.defName,
				size: 'small',
				onUpdateValue(v) {
					data.value[index].defName = v
				}
			})
		}
	},
	{
		title: '主键',
		key: 'primaryKey',
		render(row, index) {
			return h(NCheckbox, {
				checked: row.primaryKey,
				size: 'small',
				onUpdateChecked(v) {
					data.value[index].primaryKey = v
				}
			})
		}
	},
	{
		title: '不为空',
		key: 'notNull',
		render(row, index) {
			return h(NCheckbox, {
				checked: row.notNull,
				size: 'small',
				onUpdateChecked(v) {
					data.value[index].notNull = v
				}
			})
		}
	},
	{
		title: '自增',
		key: 'autoIncrement',
		render(row, index) {
			return h(NCheckbox, {
				checked: row.autoIncrement,
				size: 'small',
				onUpdateChecked(v) {
					data.value[index].autoIncrement = v
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
				onUpdateValue(v) {
					data.value[index].type = v
				}
			})
		}
	},
	{
		title: '长度',
		key: 'length',
		render(row, index) {
			return h(NInputNumber, {
				value: row.length,
				size: 'small',
				onUpdateValue(v) {
					data.value[index].length = v
				}
			})
		}
	},
	{
		title: '小数位数',
		key: 'scale',
		render(row, index) {
			return h(NInputNumber, {
				value: row.scale,
				size: 'small',
				onUpdateValue(v) {
					data.value[index].scale = v
				}
			})
		}
	},
	{
		title: '默认值',
		key: 'defaultValue',
		render(row, index) {
			return h(NInput, {
				value: row.defaultValue,
				size: 'small',
				onUpdateValue(v) {
					data.value[index].defaultValue = v
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
		data.value.push(fieldInit())
	} else {
		const index = data.value.findIndex(row => row.id === checkedRowKeys.value[0])
		data.value.splice(index + 1, 0, fieldInit())
	}
}

const handleRemoveRow = () => {
	// 判断当前是否选择了行
	if (checkedRowKeys.value.length === 0) {
		return
	}
	const index = data.value.findIndex(row => row.id === checkedRowKeys.value[0])
	data.value.splice(index, 1)
}

const handleTopRow = () => {
	// 判断当前是否选择了行
	if (checkedRowKeys.value.length === 0) {
		return
	}
	const index = data.value.findIndex(row => row.id === checkedRowKeys.value[0])
	if (index === 0) {
		return
	}
	const row = data.value.splice(index, 1)
	// 将当前行移动到第一行
	data.value.unshift(row[0])
}


const handleUpwardRow = () => {
	// 判断当前是否选择了行
	if (checkedRowKeys.value.length === 0) {
		return
	}
	const index = data.value.findIndex(row => row.id === checkedRowKeys.value[0])
	if (index === 0) {
		return
	}
	const row = data.value.splice(index, 1)
	// 将当前行移动到上一行
	data.value.splice(index - 1, 0, row[0])
}

const handleDownwardRow = () => {
	// 判断当前是否选择了行
	if (checkedRowKeys.value.length === 0) {
		return
	}
	const index = data.value.findIndex(row => row.id === checkedRowKeys.value[0])
	if (index === data.value.length - 1) {
		return
	}
	const row = data.value.splice(index, 1)
	// 将当前行移动到下一行
	data.value.splice(index + 1, 0, row[0])
}

const handleBottomRow = () => {
	// 判断当前是否选择了行
	if (checkedRowKeys.value.length === 0) {
		return
	}
	const index = data.value.findIndex(row => row.id === checkedRowKeys.value[0])
	if (index === data.value.length - 1) {
		return
	}
	const row = data.value.splice(index, 1)
	// 将当前行移动到最后一行
	data.value.push(row[0])
}

onMounted(() => {
	console.log('mounted')
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
	background-color: #eaea06;
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
