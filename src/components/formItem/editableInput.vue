<template>
  <div class="editable-input">
    <!-- 编辑模式 - 显示输入框 -->
    <a-input
      v-if="currentIsEditing"
      v-model:value="inputValue"
      @blur="handleBlur"
      @keyup.enter="handleBlur"
      @keyup.esc="handleCancel"
      ref="inputRef"
      :placeholder="placeholder"
      :size="size"
    />

    <!-- 显示模式 - 显示文本 -->
    <span
      v-else
      @click="handleClick"
      :class="['editable-text', { 'editable-text--empty': !displayValue }]"
      :title="displayValue || placeholder"
    >
      {{ displayValue || placeholder }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch } from 'vue'
import type { InputProps } from 'ant-design-vue'

interface Props {
  modelValue?: string
  placeholder?: string
  size?: InputProps['size']
  disabled?: boolean
  // 新增：外部控制是否可编辑
  editable?: boolean
  // 新增：用于标识当前单元格的唯一标识
  cellKey?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string, cellKey?: string): void
  (e: 'edit-start', cellKey?: string): void
  (e: 'edit-end', value: string, cellKey?: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '点击编辑',
  size: 'middle',
  disabled: false,
  editable: false,
  cellKey: ''
})

const emit = defineEmits<Emits>()

// 响应式数据
const isInternalEditing = ref(false)
const inputValue = ref('')
const originalValue = ref('')
const inputRef = ref()

// 计算属性 - 当前是否处于编辑状态
const currentIsEditing = computed(() => {
  return props.editable || isInternalEditing.value
})

const displayValue = computed(() => props.modelValue || '')

// 监听modelValue变化
watch(
  () => props.modelValue,
  newValue => {
    if (!currentIsEditing.value) {
      inputValue.value = newValue || ''
    }
  },
  { immediate: true }
)

// 监听外部editable变化
watch(
  () => props.editable,
  async newEditable => {
    if (newEditable) {
      // 外部控制进入编辑模式
      originalValue.value = props.modelValue || ''
      inputValue.value = props.modelValue || ''

      emit('edit-start', props.cellKey)

      await nextTick()
      if (inputRef.value) {
        inputRef.value.focus()
        inputRef.value.select()
      }
    } else {
      // 外部控制退出编辑模式时，保存当前值
      if (isInternalEditing.value) {
        handleBlur()
      }
    }
  }
)

// 点击进入编辑模式（仅在非外部控制时有效）
const handleClick = async () => {
  if (props.disabled || props.editable) return

  isInternalEditing.value = true
  originalValue.value = props.modelValue || ''
  inputValue.value = props.modelValue || ''

  emit('edit-start', props.cellKey)

  await nextTick()
  if (inputRef.value) {
    inputRef.value.focus()
    inputRef.value.select()
  }
}

// 失焦保存
const handleBlur = () => {
  if (!currentIsEditing.value) return

  const newValue = inputValue.value.trim()

  // 更新值
  emit('update:modelValue', newValue)
  emit('change', newValue, props.cellKey)
  emit('edit-end', newValue, props.cellKey)

  // 只有内部控制的编辑状态才重置
  if (!props.editable) {
    isInternalEditing.value = false
  }
}

// 取消编辑（ESC键）
const handleCancel = () => {
  if (!currentIsEditing.value) return

  inputValue.value = originalValue.value

  // 只有内部控制的编辑状态才重置
  if (!props.editable) {
    isInternalEditing.value = false
  } else {
    // 外部控制时，通知父组件取消编辑
    emit('edit-end', originalValue.value, props.cellKey)
  }
}

// 暴露给父组件的方法
defineExpose({
  startEdit: handleClick,
  cancelEdit: handleCancel,
  isEditing: () => currentIsEditing.value,
  getValue: () => inputValue.value,
  getOriginalValue: () => originalValue.value
})
</script>

<style scoped>
.editable-input {
  display: inline-block;
  min-width: 100px;
}

.editable-text {
  display: inline-block;
  padding: 4px 11px;
  min-height: 32px;
  line-height: 1.5715;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 6px;
  transition: all 0.2s;
  word-break: break-all;
}

.editable-text:hover {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
}

.editable-text--empty {
  color: #bfbfbf;
  font-style: italic;
}

.editable-text--empty:hover {
  color: #8c8c8c;
}
</style>
