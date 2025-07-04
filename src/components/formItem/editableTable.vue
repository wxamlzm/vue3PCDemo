<template>
  <div>
    <!-- 控制按钮 -->
    <div style="margin-bottom: 16px" v-if="showControls">
      <a-button type="primary" @click="toggleEditMode" :loading="saving">
        {{ isEditMode ? '保存' : '编辑' }}
      </a-button>
      <a-button v-if="isEditMode" @click="cancelEdit" style="margin-left: 8px">
        取消
      </a-button>
    </div>

    <!-- 表格 -->
    <a-table
      :dataSource="tableData"
      :columns="processedColumns"
      :pagination="pagination"
      :rowKey="rowKey"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { message } from 'ant-design-vue'
import EditableInput from './EditableInput.vue'
import type { TableColumnsType } from 'ant-design-vue'

interface EditableColumn {
  title: string
  dataIndex: string
  key?: string
  editable?: boolean
  editProps?: {
    placeholder?: string
    size?: 'small' | 'middle' | 'large'
    disabled?: boolean
  }
  // 其他 ant-design-vue 列属性
  [key: string]: any
}

interface Props {
  dataSource: any[]
  columns: EditableColumn[]
  rowKey?: string | ((record: any) => string)
  pagination?: any
  showControls?: boolean
  // 是否外部控制编辑模式
  externalEditMode?: boolean
  modelValue?: boolean
}

interface Emits {
  (e: 'save', changes: any[], groupedChanges: any[]): void
  (e: 'cancel'): void
  (
    e: 'cell-change',
    value: string,
    cellKey: string,
    record: any,
    column: EditableColumn
  ): void
  (e: 'update:modelValue', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  dataSource: () => [],
  columns: () => [],
  rowKey: 'id',
  pagination: false,
  showControls: true,
  externalEditMode: false,
  modelValue: false
})

const emit = defineEmits<Emits>()

// 表格数据
const tableData = ref([...props.dataSource])

// 编辑相关状态
const internalEditMode = ref(false)
const saving = ref(false)
const originalData = ref<any[]>([])
const changedCells = ref<Map<string, any>>(new Map())

// 计算当前编辑模式
const isEditMode = computed(() => {
  return props.externalEditMode ? props.modelValue : internalEditMode.value
})

// 处理后的列配置
const processedColumns = computed(() => {
  return props.columns.map(column => {
    if (column.editable) {
      return {
        ...column,
        customRender: ({ text, record, index }: any) => {
          const cellKey = `${getRecordKey(record)}-${column.dataIndex}`

          return h(EditableInput, {
            modelValue: text,
            editable: isEditMode.value,
            cellKey,
            placeholder:
              column.editProps?.placeholder || `请输入${column.title}`,
            size: column.editProps?.size || 'middle',
            disabled: column.editProps?.disabled || false,
            'onUpdate:modelValue': (value: string) => {
              // 更新表格数据
              record[column.dataIndex] = value
            },
            onChange: (value: string, cellKey?: string) => {
              handleCellChange(value, cellKey!, record, column)
            }
          })
        }
      }
    }
    return column
  })
})

// 获取记录的key
const getRecordKey = (record: any) => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(record)
  }
  return record[props.rowKey as string]
}

// 单元格变化处理
const handleCellChange = (
  value: string,
  cellKey: string,
  record: any,
  column: EditableColumn
) => {
  const [rowId, field] = cellKey.split('-')
  changedCells.value.set(cellKey, {
    rowId,
    field,
    value,
    record: { ...record },
    column,
    timestamp: Date.now()
  })

  emit('cell-change', value, cellKey, record, column)
}

// 切换编辑模式
const toggleEditMode = async () => {
  if (!isEditMode.value) {
    // 进入编辑模式
    originalData.value = JSON.parse(JSON.stringify(tableData.value))
    changedCells.value.clear()

    if (props.externalEditMode) {
      emit('update:modelValue', true)
    } else {
      internalEditMode.value = true
    }

    message.info('已进入编辑模式')
  } else {
    // 退出编辑模式并保存
    await saveChanges()
  }
}

// 取消编辑
const cancelEdit = () => {
  // 恢复原始数据
  tableData.value = JSON.parse(JSON.stringify(originalData.value))
  changedCells.value.clear()

  if (props.externalEditMode) {
    emit('update:modelValue', false)
  } else {
    internalEditMode.value = false
  }

  emit('cancel')
  message.info('已取消编辑')
}

// 保存更改
const saveChanges = async () => {
  if (changedCells.value.size === 0) {
    if (props.externalEditMode) {
      emit('update:modelValue', false)
    } else {
      internalEditMode.value = false
    }
    message.info('没有数据变更')
    return
  }

  try {
    saving.value = true

    // 构建要发送到后端的数据
    const changes: any[] = []
    changedCells.value.forEach((change, cellKey) => {
      changes.push({
        id: change.rowId,
        field: change.field,
        value: change.value,
        cellKey,
        record: change.record,
        column: change.column
      })
    })

    // 按行分组变更数据
    const groupedChanges = changes.reduce((acc, change) => {
      if (!acc[change.id]) {
        acc[change.id] = {
          id: change.id,
          changes: {},
          originalRecord: change.record
        }
      }
      acc[change.id].changes[change.field] = change.value
      return acc
    }, {} as Record<string, any>)

    // 发射保存事件，让父组件处理保存逻辑
    emit('save', changes, Object.values(groupedChanges))

    // 保存成功后的处理
    await handleSaveSuccess()
  } catch (error) {
    console.error('保存失败:', error)
    message.error('保存失败，请重试')
    saving.value = false
  }
}

// 保存成功处理
const handleSaveSuccess = () => {
  originalData.value = JSON.parse(JSON.stringify(tableData.value))
  changedCells.value.clear()

  if (props.externalEditMode) {
    emit('update:modelValue', false)
  } else {
    internalEditMode.value = false
  }

  saving.value = false
  message.success('保存成功')
}

// 暴露给父组件的方法
defineExpose({
  toggleEditMode,
  cancelEdit,
  saveChanges,
  getChangedCells: () => changedCells.value,
  getChangedData: () => {
    const changes: any[] = []
    changedCells.value.forEach((change, cellKey) => {
      changes.push({
        id: change.rowId,
        field: change.field,
        value: change.value,
        cellKey
      })
    })
    return changes
  },
  isEditMode: () => isEditMode.value
})

// 监听外部数据变化
watch(
  () => props.dataSource,
  newData => {
    if (!isEditMode.value) {
      tableData.value = [...newData]
    }
  },
  { deep: true }
)
</script>
