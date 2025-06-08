// ResourceEditDialog.vue
<template>
  <a-modal
    :open="visible"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-item label="姓名" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="formState.email" />
      </a-form-item>
      <a-form-item label="年龄" name="age">
        <a-input-number v-model:value="formState.age" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, nextTick } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import type { DialogFormData } from '../types/ResourceType'

const props = defineProps<{
  visible: boolean
  editData: DialogFormData
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  submit: [data: DialogFormData]
}>()

const formRef = ref<FormInstance>()
const isInitialized = ref(false)

// 定义初始值
const initialFormState: DialogFormData = {
  name: '',
  email: '',
  age: 0
}

// 内部状态，用于表单数据管理
const formState = reactive<DialogFormData>({ ...initialFormState })

// 监听弹窗显示状态
watch(
  () => props.visible,
  (newVal, oldVal) => {
    if (newVal && !oldVal) {
      // 仅在弹窗从关闭变为打开时执行
      // 使用 nextTick 确保 DOM 更新后再初始化数据
      nextTick(() => {
        if (props.editData && Object.keys(props.editData).length > 0) {
          Object.assign(formState, { ...props.editData })
        } else {
          Object.assign(formState, { ...initialFormState })
        }
        isInitialized.value = true
      })
    } else if (!newVal && oldVal) {
      // 仅在弹窗从打开变为关闭时执行
      // 延迟重置，等待弹窗动画完成
      setTimeout(() => {
        if (!props.visible) {
          // 二次确认弹窗确实是关闭状态
          formRef.value?.resetFields()
          isInitialized.value = false
        }
      }, 300)
    }
  }
)

// 仅在编辑模式下同步外部数据变化
watch(
  () => props.editData,
  newVal => {
    if (
      props.visible &&
      isInitialized.value &&
      newVal &&
      Object.keys(newVal).length > 0
    ) {
      Object.assign(formState, { ...newVal })
    }
  },
  { deep: true }
)

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    emit('submit', { ...formState })
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 取消操作
const handleCancel = () => {
  emit('update:visible', false)
}
</script>
