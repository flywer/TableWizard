<template>
  <n-card :bordered="false" size="small" class="mb-1 select-none pl-2 pr-4" :content-style="{padding:'4px'}">
    <n-flex justify="end">
      <n-button type="primary" @click="handleSave">
        保 存
      </n-button>
    </n-flex>
  </n-card>
  <!--	<n-scrollbar style="height: calc(100vh - 220px)">-->
  <div class="pr-4">
    <n-card size="small" class="mb-1 select-none" :content-style="{padding:'4px'}">
      <n-h5 prefix="bar">基础信息</n-h5>
      <n-form
          ref="formRef"
          :model="useTypeManager.getTypeData(projectId,modelId)"
          :rules="formRules"
          :size="'small'"
      >
        <n-grid :cols="2" :x-gap="4">
          <n-form-item-gi label="类型名称" path="typeName">
            <n-input v-model:value="useTypeManager.getTypeData(projectId,modelId).typeName" placeholder=""
                     size="small"/>
          </n-form-item-gi>
          <n-form-item-gi label="类型注释" path="typeComment">
            <n-input v-model:value="useTypeManager.getTypeData(projectId,modelId).typeComment" placeholder=""
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
									disabled: databaseTypes.length === 0,
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
        :data="databaseTypes"
        max-height="calc(100vh - 430px)"

        :row-key="row => row.databaseId"
        @update:checked-row-keys="handleCheckedRowKeys"
    />
    {{ useTypeManager.getTypeData(projectId, modelId) }}
    <pre>{{ JSON.stringify(databaseTypes, null, 2) }}</pre>
  </div>
  <!--	</n-scrollbar>-->
</template>

<script setup lang="ts">
import {computed, h, onMounted, PropType, reactive, ref, watch} from "vue";
import {DataTableColumns, FormInst, NButton, NFlex, NInput, NText, useThemeVars} from "naive-ui";
import {useRefHistory} from "@vueuse/core";
import {ModelOptions} from "@render/stores/useModelManager";
import TableDataInput from "@render/components/project/modelManager/tableInputer/TableDataInput.vue";
import {TypeApi} from "@render/api/TypeApi";
import {cloneDeep} from "lodash-es";
import {useTypeManagerStore} from "@render/stores/useTypeManager";
import TableSelect1 from "@render/components/project/modelManager/tableInputer/TableSelect1.vue";

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

const useTypeManager = useTypeManagerStore()

const modelId = computed(() => props.modelOptions.id)

const formRef = ref<FormInst | null>(null);

const formModel = computed(() => useTypeManager.getTypeData(props.projectId, modelId.value))

const databaseTypes = ref<DataBaseType[]>([])

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
    databaseId: null,
    type: null
  }
}

const {history, undo, redo, canUndo, canRedo} = useRefHistory(databaseTypes, {capacity: 100, deep: true, clone: cloneDeep})

const fieldNameRepeatIds = ref([])
const fieldNameRepeatIdList = computed(() => {
  return checkFieldNameRepeat(databaseTypes.value)
})

const commonTableHeader = (title: string) => {
  return h(NFlex, {justify: 'center'}, () => [
    h(NText, {depth: 2, class: 'text-xs select-none'}, () => title),
  ])
}

const checkedBackgroundClass = (row: DataBaseType) => {
  const color = useThemeVars().value.primaryColorPressed
  return checkedRowKeys.value?.at(0) == row.databaseId ? `bg-[#EAFFF2FF]` : ''
}

const createColumns = (): DataTableColumns<DataBaseType> => [
  {
    multiple: false,
    type: 'selection',
    className: 'selection-column',
  },
  {
    key: 'databaseId',
    title() {
      return commonTableHeader('数据库类型')
    },
    render(row, index) {
      return h("div", {style: {position: "relative"}}, [
        h("div", {class: "modified-marker"}),
        h(NText, {class: "row-index text-center line-height-32px " + checkedBackgroundClass(row)}, () => index + 1),
        h(TableSelect1, {
          value: row.databaseId,
          size: "small",
          options: [
            {label: 'MySQL', value: '1'},
          ],
          className: checkedBackgroundClass(row),
          'onUpdate:value': (v: string) => {
            databaseTypes.value[index].databaseId = v;
          }
        }),
      ])
    }
  },
  {
    title: '数据类型值',
    key: 'type',
    render(row, index) {
      return h(TableDataInput, {
        value: row.type,
        size: "small",
        className: checkedBackgroundClass(row),
        'onUpdate:value': (v: string) => {
          databaseTypes.value[index].type = v;
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
    databaseTypes.value.push(fieldInit())
  } else {
    const index = databaseTypes.value.findIndex(row => row.databaseId === checkedRowKeys.value[0])
    databaseTypes.value.splice(index + 1, 0, fieldInit())
  }
}

const handleRemoveRow = () => {
  // 判断当前是否选择了行
  if (checkedRowKeys.value.length === 0) {
    return
  }
  const index = databaseTypes.value.findIndex(row => row.databaseId === checkedRowKeys.value[0])
  databaseTypes.value.splice(index, 1)
}

const handleTopRow = () => {
  // 判断当前是否选择了行
  if (checkedRowKeys.value.length === 0) {
    return
  }
  const index = databaseTypes.value.findIndex(row => row.databaseId === checkedRowKeys.value[0])
  if (index === 0) {
    return
  }
  const row = databaseTypes.value.splice(index, 1)
  // 将当前行移动到第一行
  databaseTypes.value.unshift(row[0])
}

const handleUpwardRow = () => {
  // 判断当前是否选择了行
  if (checkedRowKeys.value.length === 0) {
    return
  }
  const index = databaseTypes.value.findIndex(row => row.databaseId === checkedRowKeys.value[0])
  if (index === 0) {
    return
  }
  const row = databaseTypes.value.splice(index, 1)
  // 将当前行移动到上一行
  databaseTypes.value.splice(index - 1, 0, row[0])
}

const handleDownwardRow = () => {
  // 判断当前是否选择了行
  if (checkedRowKeys.value.length === 0) {
    return
  }
  const index = databaseTypes.value.findIndex(row => row.databaseId === checkedRowKeys.value[0])
  if (index === databaseTypes.value.length - 1) {
    return
  }
  const row = databaseTypes.value.splice(index, 1)
  // 将当前行移动到下一行
  databaseTypes.value.splice(index + 1, 0, row[0])
}

const handleBottomRow = () => {
  // 判断当前是否选择了行
  if (checkedRowKeys.value.length === 0) {
    return
  }
  const index = databaseTypes.value.findIndex(row => row.databaseId === checkedRowKeys.value[0])
  if (index === databaseTypes.value.length - 1) {
    return
  }
  const row = databaseTypes.value.splice(index, 1)
  // 将当前行移动到最后一行
  databaseTypes.value.push(row[0])
}

/**
 * 校验fieldName是否存在重复，若有则返回这些行的id
 **/
const checkFieldNameRepeat = (fields: DataBaseType[]) => {
  const validFields = fields.filter(row => row.databaseId)
  const fieldNameMap = new Map<string, string>()
  const repeatIds: string[] = []
  validFields.forEach(row => {
    if (fieldNameMap.has(row.databaseId)) {
      repeatIds.push(row.databaseId)
    } else {
      fieldNameMap.set(row.databaseId, row.databaseId)
    }
  })
  return repeatIds
}

const handleSave = () => {
  formRef.value?.validate().then(() => {
    const validFields = databaseTypes.value.filter(row => row.databaseId)

    const vo: SaveDataTypeVO = {
      id: props.modelOptions.id,
      projectId: props.projectId,
      parentId: props.modelOptions.parentId,
      typeName: formModel.value.typeName,
      typeComment: formModel.value.typeComment,
      databaseTypes: validFields
    }
    TypeApi.saveDataType(vo).then(() => {
      window.$message.success('保存成功')
      useTypeManager.menuOptionInit(props.projectId)
      useTypeManager.updateTabPanelLabel(props.projectId, props.modelOptions.id, formModel.value.typeName)
    })
  })
}

watch(databaseTypes, (value) => {
  if (value) {
    useTypeManager.updateTypeDataFields(props.projectId, modelId.value, value)
  }

}, {deep: true})

/*watch(() => useTypeManager.getTypeData(props.projectId, modelId.value), (value) => {
	if (value) {
		console.log(value)
	}
}, {deep: true})*/

onMounted(async () => {
  if (!useTypeManager.hasTypeData(props.projectId, modelId.value)) {
    await useTypeManager.setTypeData(props.projectId, modelId.value)
  }
  databaseTypes.value = useTypeManager.getTypeData(props.projectId, modelId.value).databaseTypes
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

#field-table:deep(.n-scrollbar-rail--horizontal) {
  padding-top: 5px;
}

</style>
