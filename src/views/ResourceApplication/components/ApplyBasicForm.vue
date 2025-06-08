<template>
  <a-form
    :model="localFormData"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
  >
    <a-form-item label="姓名">
      <a-input v-model:value="localFormData.name" placeholder="请输入姓名" />
    </a-form-item>

    <a-form-item label="邮箱">
      <a-input v-model:value="localFormData.email" placeholder="请输入邮箱" />
    </a-form-item>

    <a-form-item label="申请类型">
      <a-checkbox-group
        v-model:value="localFormData.applyTypes"
        @change="handleApplyTypesChange"
      >
        <a-row>
          <a-col v-for="type in availableApplyTypes" :key="type" :span="8">
            <a-checkbox :value="type">
              {{ getApplyTypeLabel(type) }}
            </a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue'

// 定义一个灵活的数据接口
interface ApplyFormData {
  name?: string
  email?: string
  applyTypes?: string[]
  [key: string]: unknown
}

const props = defineProps<{
  formData: ApplyFormData
}>()

const emit = defineEmits<{
  (e: 'update:formData', value: ApplyFormData): void
  (e: 'typeChange', value: string[]): void
}>()

// 本地数据
const localFormData = ref<ApplyFormData>({
  ...props.formData,
  applyTypes: props.formData.applyTypes || []
})

// 可用的申请类型
const availableApplyTypes = computed(() => props.formData.applyTypes || [])

// 获取申请类型的显示标签
const getApplyTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    additionalResources: '额外资源',
    otherSingleForm: '其他单表单',
    // 可以根据需要添加更多映射
    default: type
  }
  return labelMap[type] || labelMap.default
}

// 处理申请类型变化
const handleApplyTypesChange = (checkedValues: string[]) => {
  emit('typeChange', checkedValues)
}

// 监听 formData 的变化，并更新本地数据
watch(
  () => props.formData,
  newVal => {
    localFormData.value = {
      ...newVal,
      applyTypes: newVal.applyTypes || []
    }
  },
  { deep: true, immediate: true }
)

// 监听本地数据的变化，并通过事件通知父组件
watch(
  () => localFormData.value,
  newVal => {
    emit('update:formData', newVal)
  },
  { deep: true }
)

// 初始化数据
onMounted(() => {
  localFormData.value = {
    ...props.formData,
    applyTypes: props.formData.applyTypes || []
  }
})
</script>
