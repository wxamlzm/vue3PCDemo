<template>
  <div class="application-form">
    <!-- 封装的公共表单组件 -->
    <CommonForm
      v-model:form-data="baseFormData"
      @type-change="handleTypeChange"
    />

    <!-- 动态表单区域 -->
    <div class="dynamic-forms">
      <!-- 单次申请表单 -->
      <div v-for="type in singleFormTypes" :key="type">
        <a-card :title="getFormTitle(type)">
          <component
            :is="getFormComponent(type)"
            :form-data="formData[type]"
            @update:form-data="val => updateFormData(type, val)"
          />
        </a-card>
      </div>

      <!-- 多次申请表单 -->
      <template v-for="type in multipleFormTypes" :key="type">
        <template v-for="(item, index) in formData[type]" :key="item.id">
          <FormWrapper
            :title="`${getFormTitle(type)} - ${index + 1}`"
            :type="type"
            :single="false"
            :show-add="index === (formData[type] as SingleFormData[]).length - 1"
            :show-delete="(formData[type] as SingleFormData[]).length > 1"
            @add="() => addForm(type)"
            @delete="() => removeForm(type, index)"
          >
            <component
              :is="getFormComponent(type)"
              v-model:form-data="formData[type][index]"
              @update:form-data="val => updateMultiFormData(type, index, val)"
            />
          </FormWrapper>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import type { Component } from 'vue'
import CommonForm from './components/CommonForm.vue'
import FormWrapper from './components/FormWrapper.vue'
import { FORM_CONFIG } from './constants'
import type { BaseFormData, SingleFormData, FormType } from './types'

// 动态引入表单组件
const formComponents: Record<FormType, Component> = {
  type1: defineAsyncComponent(() => import('./forms/Type1Form.vue')),
  type2: defineAsyncComponent(() => import('./forms/Type2Form.vue')),
  type3: defineAsyncComponent(() => import('./forms/Type3Form.vue'))
}

// 基础表单数据
const baseFormData = reactive<BaseFormData>({
  batchNo: '',
  applyTime: '',
  applyType: []
})

// 所有表单数据
const formData = reactive<Record<FormType, SingleFormData | SingleFormData[]>>(
  {}
)

// 计算属性：获取单次和多次表单类型
const singleFormTypes = computed(() =>
  baseFormData.applyType.filter(type => !isMultipleForm(type))
)

const multipleFormTypes = computed(() =>
  baseFormData.applyType.filter(type => isMultipleForm(type))
)

// 判断是否为多次申请表单
const isMultipleForm = (type: FormType): boolean => {
  return FORM_CONFIG.MULTIPLE_FORM_TYPES.includes(type)
}

// 获取对应的表单组件
const getFormComponent = (type: FormType): Component => {
  return formComponents[type]
}

// 获取表单标题
const getFormTitle = (type: FormType): string => {
  return FORM_CONFIG.TITLE_MAP[type]
}

// 创建空表单数据
const createEmptyForm = (): SingleFormData => {
  return {
    id: crypto.randomUUID()
    // ... 其他字段初始值
  }
}

// 处理申请类型变化
const handleTypeChange = (types: FormType[]) => {
  // 初始化新选中类型的表单数据
  types.forEach(type => {
    if (!formData[type]) {
      formData[type] = isMultipleForm(type)
        ? [createEmptyForm()]
        : createEmptyForm()
    }
  })

  // 清理未选中类型的表单数据
  Object.keys(formData).forEach(key => {
    if (!types.includes(key as FormType)) {
      delete formData[key as FormType]
    }
  })
}

// 更新单个表单数据
const updateFormData = (type: FormType, value: SingleFormData) => {
  formData[type] = value
}

// 更新多次申请表单数据
const updateMultiFormData = (
  type: FormType,
  index: number,
  value: SingleFormData
) => {
  ;(formData[type] as SingleFormData[])[index] = value
}

// 添加表单
const addForm = (type: FormType) => {
  if (isMultipleForm(type)) {
    ;(formData[type] as SingleFormData[]).push(createEmptyForm())
  }
}

// 删除表单
const removeForm = (type: FormType, index: number) => {
  if (isMultipleForm(type)) {
    ;(formData[type] as SingleFormData[]).splice(index, 1)
  }
}
</script>

<style scoped>
.application-form {
  max-width: 1200px;
  margin: 0 auto;
}

.dynamic-forms {
  margin-top: 24px;
}
</style>
