<template>
  <a-card :title="getFormTitle(formType)">
    <!-- 单表单模式 -->
    <div v-if="!multiple">
      <component
        :is="getFormComponent(formType)"
        :formData="formData"
        :type="type"
        @update:formData="handleSingleFormUpdate"
      ></component>
    </div>

    <!-- 多表单模式 -->
    <div v-else>
      <!-- 仅在有数据时才渲染 -->
      <template v-if="formDataArray.length > 0">
        <div
          v-for="(item, index) in formDataArray"
          :key="index"
          class="multiple-form-item relative"
        >
          <component
            :is="getFormComponent(formType)"
            :formData="item"
            :type="type"
            @update:formData="val => handleMultipleFormUpdate(val, index)"
          ></component>

          <!-- 仅在编辑模式和多于一个表单时显示删除按钮 -->
          <a-button
            v-if="formDataArray.length > 1 && type === 'edit'"
            type="text"
            danger
            class="absolute top-0 right-0"
            @click="() => removeItem(index)"
          >
            删除
          </a-button>
        </div>
      </template>

      <!-- 在编辑模式下显示添加按钮，并且仅在数据为空时自动添加一个 -->
      <div v-if="type === 'edit'" class="mt-4">
        <a-button @click="addItem" type="dashed" block> 添加新表单 </a-button>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Card, Button } from 'ant-design-vue'
import { isArray } from 'lodash'

// 定义表单数据类型，支持更灵活的数据结构
interface FormData {
  [key: string]: any
}

// 定义组件属性
const props = defineProps({
  formType: {
    type: String,
    required: true
  },
  formData: {
    type: [Object, Array],
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value: string) => ['view', 'edit', 'create'].includes(value)
  },
  resourceID: {
    type: [String, Number],
    default: null
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

// 定义事件触发器
const emit = defineEmits(['update:formData'])

// 将formData转换为数组，以支持多种使用场景
const formDataArray = computed(() =>
  isArray(props.formData) ? props.formData : [props.formData]
)

// 根据表单类型获取表单标题
function getFormTitle(formType: string): string {
  const titleMap: Record<string, string> = {
    additionalResources: '额外资源申请',
    otherSingleForm: '其他单表单申请',
    default: '通用表单'
  }
  return titleMap[formType] || titleMap.default
}

// 根据表单类型动态选择组件
function getFormComponent(formType: string): string {
  const componentMap: Record<string, string> = {
    additionalResources: 'AdditionalResourcesForm',
    otherSingleForm: 'OtherSingleForm',
    default: 'DefaultForm'
  }
  return componentMap[formType] || componentMap.default
}

// 处理单表单数据更新
function handleSingleFormUpdate(val: FormData) {
  emit('update:formData', val)
}

// 处理多表单数据更新
function handleMultipleFormUpdate(val: FormData, index: number) {
  const newFormData = [...formDataArray.value]
  newFormData[index] = val
  emit('update:formData', newFormData)
}

// 添加新表单项
function addItem() {
  if (isArray(props.formData)) {
    const newFormData = [...props.formData, {}]
    emit('update:formData', newFormData)
  } else {
    // 如果是单个对象，转换为数组
    emit('update:formData', [props.formData, {}])
  }
}

// 删除指定索引的表单项
function removeItem(index: number) {
  if (isArray(props.formData) && props.formData.length > 1) {
    const newFormData = props.formData.filter((_, i) => i !== index)
    emit('update:formData', newFormData)
  }
}

// 监听formType的变化
watch(
  () => props.formType,
  (newFormType) => {
    // 在这里处理formType变化时的逻辑
    console.log('formType changed to:', newFormType)
    // 如果需要更新UI或执行其他操作，可以在这里添加相应代码
  }
)

// 在编辑模式下，如果数据为空，自动添加一个
onMounted(() => {
  if (
    props.multiple &&
    props.type === 'edit' &&
    formDataArray.value.length === 0
  ) {
    addItem()
  }
})
</script>

<style scoped>
.multiple-form-item {
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}
</style>