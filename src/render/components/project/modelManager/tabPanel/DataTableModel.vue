<template>
  <div>
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

    <n-data-table :size="'small'" :columns="columns" :data="data"/>
  </div>

  <pre>{{ JSON.stringify(data, null, 2) }}</pre>
</template>

<script setup lang="ts">
import {ModelTabPanel} from "@render/stores/useProjectPage";
import {h, PropType, ref} from "vue";
import {DataTableColumns, NButton, NFlex, NIcon, NInput} from "naive-ui";
import {ArrowSync16Regular} from "@vicons/fluent";
import {v4 as uuidv4} from 'uuid';

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
    fieldInit()
  ]
}

const data = ref<TableField[]>(createData())

const createColumns = (): DataTableColumns<TableField> => [
  {
    title: '字段名称',
    key: 'defKey',
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
    title: '字段类型',
    key: 'type',
    render(row, index) {
      return h(NInput, {
        value: row.type,
        size: 'small',
        onUpdateValue(v) {
          data.value[index].type = v
        }
      })
    }
  },
  {
    title: '字段长度',
    key: 'length',
    render(row, index) {
      return h(NInput, {
        value: row.length,
        size: 'small',
        onUpdateValue(v) {
          data.value[index].length = v
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
