<template>
  <a-card>
    <!-- 基础表单组件 -->
    <ApplyBasicForm
      v-model:formData="applyBasicFormData"
      @typeChange="handleTypesChange"
    />
  </a-card>

  <div style="height: 10px"></div>

  <!-- 动态表单部分 -->
  <dynamic-form
    v-for="applyType in applyBasicFormData.applyTypes"
    :key="applyType"
    :formType="applyType"
    :formData="formData[applyType]"
    :type="applyType"
    :resourceID="formData.id"
    :multiple="isMultiple(applyType)"
    @update:formData="val => updateFormData(applyType, val)"
  />

  <footer>
    <a-space>
      <a-button @click="submitDraft">提交草稿</a-button>
      <a-button @click="submitApply">提交申请</a-button>
    </a-space>
  </footer>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { Card, Space, Button } from 'ant-design-vue'
import ApplyBasicForm from './components/ApplyBasicForm.vue' // 基础表单组件
import DynamicForm from './components/DynamicForm.vue' // 动态表单组件
import { isArray } from 'lodash'
import type { BackendData } from './types.d.ts'

// 定义所有可用的申请类型
const availableApplyTypes = [
  'additionalResources',
  'otherSingleForm'
  // 可以根据需要添加更多类型
]

// 定义组件接收的Props
const props = defineProps({
  initData: {
    type: Object,
    default: () => ({})
  }
})

// 定义组件可以触发的事件
const emit = defineEmits(['update:formData'])

// 基础表单数据
const applyBasicFormData = ref({
  name: '',
  email: '',
  applyDate: '',
  applyTypes: [] as string[] // 改为数组类型
})

// 动态表单数据
const formData = reactive<Record<string, any>>({})

// 判断某个表单类型是否为多选
const isMultiple = (formType: string) => {
  return isArray(formData[formType])
}

// 处理表单类型变更
function handleTypesChange(newTypes: string[]) {
  // 更新选中的申请类型
  console.log(newTypes)
  applyBasicFormData.value.applyTypes = newTypes
}

// 更新表单数据并向父组件发送事件
function updateFormData(formType: string, value: any) {
  formData[formType] = value
  emit('update:formData', formData)
}

// 提交的数据
const submitData = ref([])

// 提交草稿的方法
const submitDraft = () => {
  // TODO: 实现提交草稿的具体逻辑
  console.log('提交草稿', formData)
}

// 提交申请的方法
const submitApply = async () => {
  try {
    const params = {
      name: applyBasicFormData.value.name,
      email: applyBasicFormData.value.email,
      batchStatus: 'BATCH_STATUS.apply',
      applyInfo: {
        applyTypes: applyBasicFormData.value.applyTypes,
        ...submitData.value,
        applyDate: applyBasicFormData.value.applyDate
      }
    }
    // TODO: 实现提交申请的具体逻辑，如接口调用
    console.log('提交申请', params)
  } catch (err) {
    console.error(err)
  }
}

// 判断表单类型的函数
function determineFormType(data: any) {
  if (isArray(data)) {
    return 'multiple'
  } else if (typeof data === 'object' && data !== null) {
    return 'single'
  }
  return ''
}

// 组件挂载时初始化数据
onMounted(() => {
  // 模拟从后端获取的数据
  const backendData: any = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    additionalResources: [
      {
        resourceName: 'Resource 1',
        resourceType: 'Type 1'
      },
      {
        resourceName: 'Resource 2',
        resourceType: 'Type 2'
      }
    ],
    otherSingleForm: {
      someField: 'Some Value'
    }
  }

  // 初始化基础表单数据
  applyBasicFormData.value = {
    name: backendData.name,
    email: backendData.email,
    applyDate: '', // 根据实际需求设置
    applyTypes: [] // 初始化为空数组
  }

  // 动态判断并初始化表单类型和数据
  Object.keys(backendData).forEach(key => {
    if (!['name', 'email'].includes(key)) {
      const formType = determineFormType(backendData[key])

      if (formType === 'multiple' || formType === 'single') {
        formData[key] = backendData[key]

        // 如果key在可用的申请类型中，添加到applyTypes
        if (availableApplyTypes.includes(key)) {
          applyBasicFormData.value.applyTypes.push(key)
        }
      }
    }
  })
})
</script>
