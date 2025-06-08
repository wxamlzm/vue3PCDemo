<script lang="ts">
import { defineComponent, ref, reactive, watch } from 'vue'
import { Form, Input, Checkbox, Table } from 'ant-design-vue'
import type { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox'
import type { FormInstance } from 'ant-design-vue/es/form'

interface FormState {
  name: string
  department: string
  reason: string
  selectedTypes: string[]
}

interface ResourceItem {
  id: number
  name: string
  type: string
  status: string
  quantity: number
}

export default defineComponent({
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group,
    ATable: Table
  },
  setup() {
    const formRef = ref<FormInstance>()

    // 表单数据
    const formState = reactive<FormState>({
      name: '',
      department: '',
      reason: '',
      selectedTypes: []
    })

    // 资源类型选项
    const resourceTypes = ref([
      { label: '服务器', value: 'server' },
      { label: '数据库', value: 'database' },
      { label: '存储', value: 'storage' }
    ])

    // 资源列表数据
    const resourceList = ref<ResourceItem[]>([
      {
        id: 1,
        name: '高性能服务器',
        type: 'server',
        status: '可用',
        quantity: 5
      },
      {
        id: 2,
        name: 'MySQL实例',
        type: 'database',
        status: '可用',
        quantity: 3
      },
      {
        id: 3,
        name: '对象存储',
        type: 'storage',
        status: '可用',
        quantity: 10
      },
      {
        id: 4,
        name: '计算服务器',
        type: 'server',
        status: '维护中',
        quantity: 2
      },
      {
        id: 5,
        name: 'Redis实例',
        type: 'database',
        status: '可用',
        quantity: 4
      }
    ])

    // 表格列定义
    const columns = [
      { title: '资源名称', dataIndex: 'name', key: 'name' },
      { title: '资源类型', dataIndex: 'type', key: 'type' },
      { title: '状态', dataIndex: 'status', key: 'status' },
      { title: '可用数量', dataIndex: 'quantity', key: 'quantity' }
    ]

    // 筛选后的资源列表
    const filteredResourceList = ref<ResourceItem[]>([])

    // 监听选中类型变化，更新列表
    watch(
      () => formState.selectedTypes,
      newTypes => {
        if (newTypes.length === 0) {
          filteredResourceList.value = resourceList.value
        } else {
          filteredResourceList.value = resourceList.value.filter(item =>
            newTypes.includes(item.type)
          )
        }
      },
      { immediate: true }
    )

    // 表单提交
    const onSubmit = () => {
      formRef.value
        ?.validate()
        .then(() => {
          console.log('表单数据:', formState)
          console.log('筛选后的资源列表:', filteredResourceList.value)
        })
        .catch(errors => {
          console.log('表单验证失败:', errors)
        })
    }

    return {
      formRef,
      formState,
      resourceTypes,
      columns,
      filteredResourceList,
      onSubmit
    }
  }
})
</script>

<template>
  <div class="resource-request-detail">
    <!-- 表单部分 -->
    <a-form ref="formRef" :model="formState" class="form-section">
      <a-form-item
        label="申请人"
        name="name"
        :rules="[{ required: true, message: '请输入申请人姓名' }]"
      >
        <a-input
          v-model:value="formState.name"
          placeholder="请输入申请人姓名"
        />
      </a-form-item>

      <a-form-item
        label="所属部门"
        name="department"
        :rules="[{ required: true, message: '请输入所属部门' }]"
      >
        <a-input
          v-model:value="formState.department"
          placeholder="请输入所属部门"
        />
      </a-form-item>

      <a-form-item
        label="申请原因"
        name="reason"
        :rules="[{ required: true, message: '请输入申请原因' }]"
      >
        <a-input
          v-model:value="formState.reason"
          placeholder="请输入申请原因"
        />
      </a-form-item>

      <a-form-item label="资源类型" name="selectedTypes">
        <a-checkbox-group
          v-model:value="formState.selectedTypes"
          :options="resourceTypes"
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" @click="onSubmit">提交申请</a-button>
      </a-form-item>
    </a-form>

    <!-- 资源列表部分 -->
    <div class="list-section">
      <h3>可用资源列表</h3>
      <a-table
        :columns="columns"
        :data-source="filteredResourceList"
        :row-key="(record: ResourceItem) => record.id"
      />
    </div>
  </div>
</template>

<style scoped>
.resource-request-detail {
  padding: 24px;
}

.form-section {
  margin-bottom: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 2px;
}

.list-section {
  background: #fff;
  padding: 24px;
  border-radius: 2px;
}

h3 {
  margin-bottom: 16px;
}
</style>
