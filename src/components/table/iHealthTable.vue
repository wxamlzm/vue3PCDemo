<!-- 当前i健康项目用的table组件 -->
<template>
  <a-table
    size="small"
    :rowKey="rowKey"
    :bordered="false"
    :loading="needLoading ? tableLoading : undefined"
    :dataSource="tableDataSource"
    :rowSelection="rowSelection"
    ref="tableRef"
  ></a-table>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { get } from 'lodash'

interface ITableProps {
  fetchList: (params: any) => Promise<object>
  needLoading?: boolean
  rowKey?: string
  queryParams: object
}

const props = withDefaults(defineProps<ITableProps>(), {
  rowKey: 'id'
})
const emit = defineEmits<{ updateSelectedRowKeys }>()

const tableLoading = ref(false)
const tableDataSource = ref([])
const selectedRowKeys = ref<(number | string)[]>([])
const currentQueryParams = ref<object>({})

const rowSelection = {
  checkStrictly: false,
  selectedRowKeys: selectedRowKeys,
  onSelect: (record, selected, selectedRows) => {
    if (selected) {
      // 如果是选中操作，将当前行的id添加到
      selectedRowKeys.value = [...selectedRowKeys.value, record.id]
    } else {
      selectedRowKeys.value = selectedRowKeys.value.filter(
        id => id !== record.id
      )
    }
    emit('updateSelectedRowKeys', selectedRowKeys.value)
  }
}

// 列表分页
const pageInfo = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0
})

// 处理分页变化 - 自动触发查询
const handlePageChange = (page: number, pageSize: number) => {
  pageInfo.current = page
  pageInfo.pageSize = pageSize
  fetchTableList(currentQueryParams.value)
}

// 查询列表 - 用于手动触发的首次查询
const searchList = async (queryParams: object) => {
  currentQueryParams.value = queryParams // 保存最新的查询参数
  pageInfo.current = 1 // 重置到第一页
  await fetchTableList(queryParams)
}

const fetchTableList = async () => {
  const queryParams = props.queryParams

  try {
    tableLoading.value = true
    const res: any = await props.fetchList({ ...queryParams, ...pageInfo })
    tableDataSource.value = get(res, 'records') || []
  } catch (err) {
    console.error(err)
  }
}

defineExpose({
  searchList
})
</script>
