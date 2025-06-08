<template>
  <a-select
    v-model:value="displayValue"
    :options="processedOptions"
    :loading="!isOptionsReady"
    @change="handleChange"
  >
    <a-select-option
      v-for="option in processedOptions"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue'

interface Option {
  value: string
  label: string
}

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 核心状态管理
const isOptionsReady = ref(false)
const pendingValue = ref<string | null>(null)
const rawOptions = ref<Option[]>([])

// 处理后的 options（可根据需要扩展）
const processedOptions = computed(() => rawOptions.value)

// 最终显示的值（包含防抖和验证逻辑）
const displayValue = ref('')

// 异步获取 options 的方法
const loadOptions = async () => {
  try {
    // 替换为实际接口调用
    rawOptions.value = await mockApiRequest()
    isOptionsReady.value = true
  } catch (error) {
    console.error('Failed to load options:', error)
    rawOptions.value = []
  }
}

// 值验证和同步机制
const validateAndSyncValue = (targetValue: string) => {
  const isValid = rawOptions.value.some(opt => opt.value === targetValue)

  if (isValid) {
    displayValue.value = targetValue
    pendingValue.value = null
  } else {
    const fallback = rawOptions.value[0]?.value || ''
    console.warn(`Invalid value ${targetValue}, fallback to ${fallback}`)
    displayValue.value = fallback
    emit('update:modelValue', fallback)
  }
}

// 处理父级传入的值变化
watch(
  () => props.modelValue,
  newVal => {
    if (!isOptionsReady.value) {
      pendingValue.value = newVal
      return
    }
    validateAndSyncValue(newVal)
  }
)

// 处理 options 加载完成后的逻辑
watch(isOptionsReady, ready => {
  if (ready && pendingValue.value !== null) {
    validateAndSyncValue(pendingValue.value)
  }
})

// 处理用户交互
const handleChange = (value: string) => {
  emit('update:modelValue', value)
}

// 初始化加载
onMounted(() => {
  loadOptions()
})

// 模拟接口请求
const mockApiRequest = (): Promise<Option[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' }
      ])
    }, 1500) // 模拟 1.5 秒延迟
  })
}
</script>
