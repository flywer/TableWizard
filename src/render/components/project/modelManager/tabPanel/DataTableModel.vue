<template>
  <div>
    <n-card :bordered="false" size="small" class="mb-1 select-none pl-2 pr-2" :content-style="{padding:'4px'}">
      <n-flex justify="end">
        <n-button type="primary" @click="handleSave">
          保 存
        </n-button>
      </n-flex>
    </n-card>
    <n-scrollbar style="height: calc(100vh - 125px - 42px)">
      <n-card size="small" class="mb-1 select-none" :content-style="{padding:'4px'}">
        <n-h5 prefix="bar">数据表信息</n-h5>
        <n-form
            ref="formRef"
            :model="formModel"
            :rules="formRules"
            :size="'small'"
        >
          <n-grid :cols="2" :x-gap="4">
            <n-form-item-gi label="表名称" path="tableName">
              <n-input v-model:value="formModel.tableName" placeholder="表名称" size="small"/>
            </n-form-item-gi>
            <n-form-item-gi label="表注释" path="tableComment">
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
      {{ modelOptions }}
      <pre>{{ JSON.stringify(fields, null, 2) }}</pre>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import {h, onMounted, PropType, reactive, ref, watch} from "vue";
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
import {ModelOptions} from "@render/stores/useModelManager";
import TableDataInput from "@render/components/project/modelManager/tableInputer/TableDataInput.vue";
import TableDataNumberInput from "@render/components/project/modelManager/tableInputer/TableDataNumberInput.vue";
import {ModelApi} from "@render/api/ModelApi";

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

const formRef = ref<FormInst | null>(null);
const formModel = reactive({
  tableName: null,
  tableComment: null
})

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

const fields = ref<EntityField[]>([])

const {history, undo, redo, canUndo, canRedo} = useRefHistory(fields, {deep: true, capacity: 100})

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
        true ? h("div", {class: "modified-marker"}) : null,
        h(NText, {class: "row-index pl-3 " + checkedBackgroundClass(row)}, () => index + 1),
        h(TableDataInput, {
          value: row.fieldName,
          size: "small",
          validation: {
            message: "字段名称不能重复",
            status: checkFieldNameRepeat(fields.value).includes(row.id) ? 'error' : undefined
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
      return h(NInput, {
        value: row.fieldComment,
        size: 'small',
        onUpdateValue(v) {
          fields.value[index].fieldComment = v
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
          fields.value[index].primaryKey = v
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
          fields.value[index].notNull = v
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
        onUpdateValue(v) {
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
        onUpdateValue(v) {
          fields.value[index].length = v
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
          fields.value[index].scale = v
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
          fields.value[index].defaultValue = v
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
      tableName: formModel.tableName,
      tableComment: formModel.tableComment,
      fields: validFields
    }
    ModelApi.saveDatatable(vo).then(() => {
      console.log('保存成功')
    })
  })
}

watch(fields, (value) => {
  // 每次更新表单都会触发校验
  const fieldNameRepeat = checkFieldNameRepeat(value);
  console.log(fieldNameRepeat)
}, {deep: true})

onMounted(() => {
  if (props.modelOptions.id) {
    ModelApi.getDataTable(props.projectId,props.modelOptions.id).then((res) => {
      formModel.tableName = res.tableName
      formModel.tableComment = res.tableComment
      fields.value = res.fields
    })
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
