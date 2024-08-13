<template>
  <div>
    <n-card size="small" class="mb-1 select-none" :content-style="{padding:'4px'}">
      <template #default>
        <n-flex :size="'small'" justify="space-between">
          <n-flex class="items-center">
            <n-pagination
                v-model:page="paginationReactive.page"
                v-model:page-size="paginationReactive.pageSize"
                :item-count="paginationReactive.itemCount"
                :page-sizes="[10, 20, 30, 40]"
                show-size-picker
                :size="'small'"
                @update:page="paginationReactive.onChange"
                @update:page-size="paginationReactive.onUpdatePageSize"
            >
              <template #prev>
                <n-icon>
                  <ChevronLeft12Regular/>
                </n-icon>
              </template>
              <template #next>
                <n-icon>
                  <ChevronRight12Regular/>
                </n-icon>
              </template>
            </n-pagination>

            <n-flex class="items-center justify-center h-full" :size="2">
              <n-divider vertical style="margin-left: 0;"/>
              <n-button :size="'tiny'" quaternary @click="fetchData()" :disabled="isLoading">
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
        id="data-table"
        :columns="columns"
        :data="tableData"
        :size="size"
        :striped="striped"
        :bordered="bordered"
        :loading="isLoading"
        :pagination="paginationReactive"
        :max-height="maxHeight"
        :scroll-x="scrollX"
        :scrollbar-props="scrollbarProps"
        :single-line="singleLine"
        :summary="summary"
        :summary-placement="summaryPlacement"
        @load="handleLoad"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ArrowSync16Regular,
  ChevronLeft12Regular,
  ChevronRight12Regular,
} from "@vicons/fluent";
import {NButton, NFlex, NIcon} from "naive-ui";
import {onMounted, reactive, ref, watch, PropType} from "vue";
import {isEqual} from "lodash-es";
import {isEmpty} from "lodash";

const props = defineProps({
  columns: Array<any>,
  fetchData: Function,
  fetchDataParams: Object,
  size: {
    type: String as PropType<"small" | "medium" | "large">,
    required: false
  },
  striped: {
    type: Boolean,
    required: false
  },
  bordered: {
    type: Boolean,
    required: false
  },
  /**
   * 是否分页加载，若为否，代表数据一次性加载
   **/
  pageLoad: {
    type: Boolean,
    default: true,
    required: false
  },
  maxHeight: {
    type: [Number, String] as PropType<number | string>,
    required: false
  },
  scrollX: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
    required: false
  },
  scrollbarProps: {
    default: undefined,
    required: false
  },
  singleLine: {
    required: false
  },
  reloadFlag: {
    type: [String, Number]
  },
  summary: {
    required: false
  },
  summaryPlacement: {
    type: String as PropType<"top" | "bottom">,
    required: false
  },
  load: {
    type: Function
  },
  /**
   * 当tableData为空时，才默认加载，为true则默认加载
   **/
  defaultData: Array<any>
})

const tableData = ref<any[]>([])

const isLoading = ref(false)

// 定义响应式的分页对象
const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  async onChange(page: number) {
    if (props.pageLoad)
      await fetchData();
    paginationReactive.page = page
  },
  async onUpdatePageSize(pageSize: number) {
    if (props.pageLoad)
      await fetchData();
    paginationReactive.pageSize = pageSize;
  }
});

onMounted(() => {
  if (props.defaultData && !isEmpty(props.defaultData)) {
    tableData.value = props.defaultData
    paginationReactive.itemCount = props.defaultData.length
  } else {
    fetchData();
  }
})

// 监视页码和页大小的变化，获取数据
const fetchData = async () => {
  isLoading.value = true;
  try {
    const params = {
      ...props.fetchDataParams,
      page: paginationReactive.page,
      pageSize: paginationReactive.pageSize,
    };

    const data = await props.fetchData(params)
    tableData.value = data?.records || []; // 赋值
    paginationReactive.itemCount = data.total; // 更新总条数
  } catch (error) {
    // 处理错误情况
  }
  isLoading.value = false;
};

// 包装一层以提供给外部调用
const updateData = async () => {
  await fetchData();
}

const handleLoad = async (row: any) => {
  return new Promise<void>(async resolve => {
    if (props.load)
      props.load(row)
    resolve()
  })
}

// 观察fetchDataParams的变化，并重新获取数据
watch(() => props.fetchDataParams, (value, oldValue) => {
  if (!isEqual(value, oldValue)) {
    updateData();
  }
}, {deep: true});

watch(() => props.reloadFlag, (value, oldValue) => {
  if (oldValue && value) {
    updateData();
  }
})

</script>

<style scoped lang="less">
:deep(.error-bg) {
  background: rgba(255, 100, 0, 0.1);
  color: rgb(255, 100, 0);
}

#data-table:deep(.n-data-table__pagination) {
  display: none;
}
</style>
