<template>
	<div>
		<n-scrollbar style="height: calc(100vh - 125px)">
			<n-card size="small" class="mb-1 select-none" :content-style="{padding:'4px'}">
				<template #default>
					<n-flex :size="'small'" justify="space-between">
						<n-flex class="items-center">
							<n-flex class="items-center justify-center h-full" :size="2">
								<n-divider vertical style="margin-left: 0;"/>
								<n-button :size="'tiny'" quaternary>
									<template #icon>
										<n-icon :size="16">
											<ArrowSync16Regular/>
										</n-icon>
									</template>
								</n-button>
							</n-flex>
							<n-flex class="items-center justify-center h-full" :size="2">
								<n-divider vertical style="margin-left: 0;"/>
								<slot name="buttons"></slot>
							</n-flex>
						</n-flex>
						<n-flex class="items-center">
							<slot name="rightContent"></slot>
						</n-flex>
					</n-flex>
				</template>
			</n-card>

			<n-data-table
				:bordered="false"
				:single-line="false"
				:size="'small'"
				:columns="columns"
				:data="data"
				:max-height="550"
				:scroll-x="1500"
			/>
			<pre>{{ JSON.stringify(data, null, 2) }}</pre>
		</n-scrollbar>
	</div>
</template>

<script setup lang="ts">
import {ModelTabPanel} from "@render/stores/useProjectPage";
import {h, PropType, ref, toRaw} from "vue";
import {DataTableColumns, NButton, NCheckbox, NFlex, NIcon, NInput, NInputNumber, NText} from "naive-ui";
import {ArrowSync16Regular} from "@vicons/fluent";
import {v4 as uuidv4} from 'uuid';
import {NSelect} from "naive-ui/lib";

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

const fieldInit = () => {
	return {
		id: uuidv4(),
		defKey: uuidv4(),
		defName: uuidv4(),
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


function createData(): TableField[] {
	return [
		fieldInit(),
		fieldInit(),
		fieldInit(),
		fieldInit(),
		fieldInit(),
		fieldInit(),
		fieldInit(),
	]
}

const data = ref<TableField[]>(createData())

const commonTableHeader = (title: string) => {
	return h(NFlex, {justify:'center'}, () => [
		h(NText, {depth: 2, class: 'text-xs select-none'}, () => title),
	])
}

const createColumns = (): DataTableColumns<TableField> => [
	{
		key: 'defKey',
		title() {
			return commonTableHeader('字段名称')
		},
		render(row, index) {
			return h(NInput, {
				value: row.defKey,
				size: 'small',
				onUpdateValue(v) {
					data.value[index].defKey = v
				}
			})
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
			return h(NSelect, {
				value: row.type,
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

const pagination = {
	pageSize: 10
}
</script>

<style scoped lang="less">

</style>
