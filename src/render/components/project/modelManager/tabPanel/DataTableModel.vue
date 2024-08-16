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
            <n-flex class="items-center">
              <n-flex class="items-center justify-center h-full" :size="0">
                <component
                    :is="tableButton('i-material-symbols:vertical-align-top-rounded', () => handleColumnTop())"/>
                <component
                    :is="tableButton('i-material-symbols:arrow-upward-rounded', () => handleColumnTop())"/>
                <component
                    :is="tableButton('i-material-symbols:arrow-downward-rounded', () => handleColumnTop())"/>
                <component
                    :is="tableButton('i-material-symbols:vertical-align-bottom-rounded', () => handleColumnTop())"/>

              </n-flex>
              <n-divider vertical style="margin-left: 0;"/>
              <n-flex class="items-center justify-center h-full" :size="2">

                <slot name="buttons"></slot>
              </n-flex>
            </n-flex>

            <n-flex class="items-center">

            </n-flex>
          </n-flex>
        </template>
      </n-card>

      <n-data-table
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
import {h, PropType, reactive, ref} from "vue";
import {DataTableColumns, FormInst, NButton, NCheckbox, NFlex, NInput, NInputNumber, NText} from "naive-ui";
import {v4 as uuidv4} from 'uuid';
import TableSelect from "@render/components/project/modelManager/tableInputer/TableSelect.vue";

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


const tableButton = (iconClassName: string, onClick: () => void) => {
  return h(NButton, {size: 'tiny', quaternary: true, onClick}, {
    default: () => h('div', {class: iconClassName + ' text-18px'})
  })
}

const handleColumnTop = () => {
  console.log('handleColumnTop')
}

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

function createData(): EntityField[] {
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

const data = ref<EntityField[]>(createData())

const commonTableHeader = (title: string) => {
  return h(NFlex, {justify: 'center'}, () => [
    h(NText, {depth: 2, class: 'text-xs select-none'}, () => title),
  ])
}

const createColumns = (): DataTableColumns<EntityField> => [
  {
    multiple: false,
    type: 'selection'
  },
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

const handleCheckedRowKeys = (keys: Array<string>) => {
  console.log(keys)
}
</script>

<style scoped lang="less">

</style>
