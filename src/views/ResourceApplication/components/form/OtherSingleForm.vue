<template>
  <a-form
    :model="localFormData"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
  >
    <a-form-item label="字段名称">
      <a-input
        v-model:value="localFormData.someField"
        placeholder="请输入字段值"
      />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Form, Input } from 'ant-design-vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:formData'])

// 本地数据
const localFormData = ref({ ...props.formData })

// 监听 formData 的变化，并更新本地数据
watch(
  () => props.formData,
  newVal => {
    localFormData.value = { ...newVal }
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
  localFormData.value = { ...props.formData }
})
</script>
