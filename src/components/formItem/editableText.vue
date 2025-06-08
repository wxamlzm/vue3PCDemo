// EditableText.vue
<template>
  <div class="editable-container">
    <!-- 编辑模式 -->
    <el-input
      v-show="isEditing"
      ref="inputRef"
      v-bind="$attrs"
      :model-value="modelValue"
      @blur="handleBlur"
      @keyup.enter="handleEnter"
    />

    <!-- 展示模式 -->
    <div
      v-show="!isEditing"
      class="display-mode"
      :class="{ 'placeholder-text': !modelValue }"
      @click="enterEdit"
    >
      {{ displayText }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue'
import type { ElInput } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: '点击输入内容'
  },
  size: {
    type: String as () => 'default' | 'small' | 'large',
    default: 'default'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const inputRef = ref<InstanceType<typeof ElInput>>()
const isEditing = ref(false)

// 显示文本计算
const displayText = computed(() => {
  return props.modelValue || props.placeholder
})

// 进入编辑模式
const enterEdit = async () => {
  isEditing.value = true
  await nextTick()
  inputRef.value?.focus()
}

// 处理失焦
const handleBlur = (e: Event) => {
  isEditing.value = false
  emitChange(e)
}

// 处理回车
const handleEnter = (e: Event) => {
  isEditing.value = false
  emitChange(e)
}

// 统一触发变更
const emitChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const newValue = target.value
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

// 暴露方法给父组件
defineExpose({
  enterEdit,
  exitEdit: () => {
    isEditing.value = false
  }
})
</script>

<style scoped>
.editable-container {
  display: inline-block;
  min-width: 100px;
}

.display-mode {
  padding: 5px 12px;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.display-mode:hover {
  border-color: #dcdfe6;
  background-color: #f5f7fa;
}

.placeholder-text {
  color: #999;
}
</style>
