<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import type { Developer, FormState } from '../types/ResourceType'

// Props 定义
interface Props {
  visible: boolean
  isEdit?: boolean
  initialData?: Partial<FormState>
}

// withDefaults是什么
const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  initialData: () => ({})
})

// Emits 定义
const emit = defineEmits<{
  'update:visible': [value: boolean]
  submit: [data: FormState]
  cancel: []
}>()

// 表单实例
const formRef = ref<FormInstance>()

// 表单数据
const formState = reactive<FormState>({
  groupId: '',
  projectName: '',
  gitlabIdentifier: '',
  status: true,
  createDevBranch: false,
  createMainBranch: false,
  developers: [],
  remarks: ''
})

// 开发人员选项数据（实际应从API获取）
const developerOptions = ref([
  { label: '开发者1', value: 'dev1' },
  { label: '开发者2', value: 'dev2' }
  // ... 更多开发者
])

// 权限选项数据
const permissionOptions = [
  { label: '读取', value: 'read' },
  { label: '写入', value: 'write' },
  { label: '管理', value: 'admin' }
]

// 表格列定义
const developerColumns = [
  {
    title: '开发人员',
    dataIndex: 'developer',
    key: 'developer',
    width: '40%'
  },
  {
    title: '权限配置',
    dataIndex: 'permissions',
    key: 'permissions',
    width: '40%'
  },
  {
    title: '操作',
    key: 'action',
    width: '20%'
  }
]

// 添加开发人员
const addDeveloper = () => {
  formState.developers.push({
    key: `dev-${Date.now()}`,
    developerId: '',
    permissions: []
  })
}

// 移除开发人员
const removeDeveloper = (index: number) => {
  formState.developers.splice(index, 1)
}

// 开发人员选择变更处理
const handleDeveloperChange = (value: string, index: number) => {
  // 可以在这里添加额外的逻辑，比如检查重复选择等
  console.log('Developer changed:', value, 'at index:', index)
}

// 表单验证规则
const rules = {
  groupId: [{ required: true, message: '请输入GitLab分组ID' }],
  projectName: [{ required: true, message: '请输入项目名称' }],
  gitlabIdentifier: [{ required: true, message: '请输入GitLab标识' }],
  developers: [
    {
      validator: async (_: any, value: Developer[]) => {
        if (!value.length) {
          return Promise.reject('请至少添加一个开发人员')
        }
        for (const dev of value) {
          if (!dev.developerId) {
            return Promise.reject('请选择开发人员')
          }
          if (!dev.permissions.length) {
            return Promise.reject('请为开发人员配置权限')
          }
        }
        return Promise.resolve()
      }
    }
  ]
}

// 提交处理
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    emit('submit', { ...formState })
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

// 取消处理
const handleCancel = () => {
  formRef.value?.resetFields()
  emit('update:visible', false)
  emit('cancel')
}

// 计算属性
const modalTitle = computed(() => (props.isEdit ? '编辑项目' : '新增项目'))

// 监听初始数据变化
watch(
  () => props.initialData,
  val => {
    if (val) {
      Object.assign(formState, val)
    }
  },
  { immediate: true }
)
</script>

<template>
  <a-modal
    :open="visible"
    :title="modalTitle"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :width="800"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <!-- 基本信息部分 - 两列布局 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="GitLab分组ID" name="groupId">
            <a-input
              v-model:value="formState.groupId"
              placeholder="请输入GitLab分组ID"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="项目名称" name="projectName">
            <a-input
              v-model:value="formState.projectName"
              placeholder="请输入项目名称"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="GitLab标识" name="gitlabIdentifier">
            <a-input
              v-model:value="formState.gitlabIdentifier"
              placeholder="请输入GitLab标识"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="状态" name="status">
            <a-switch
              v-model:checked="formState.status"
              checked-children="启用"
              un-checked-children="停用"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="创建dev分支" name="createDevBranch">
            <a-switch v-model:checked="formState.createDevBranch" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="创建main分支" name="createMainBranch">
            <a-switch v-model:checked="formState.createMainBranch" />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 开发人员权限配置部分 - 使用表格 -->
      <a-form-item
        label="开发人员权限"
        name="developers"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 21 }"
      >
        <div class="developers-table-wrapper">
          <a-button
            type="primary"
            size="small"
            @click="addDeveloper"
            style="margin-bottom: 16px"
          >
            添加开发人员
          </a-button>
          <a-table
            :columns="developerColumns"
            :data-source="formState.developers"
            :pagination="false"
            size="small"
            bordered
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'developer'">
                <a-select
                  v-model:value="record.developerId"
                  style="width: 100%"
                  placeholder="请选择开发人员"
                  show-search
                  :options="developerOptions"
                  @change="(value: string) => handleDeveloperChange(value, index)"
                />
              </template>
              <template v-else-if="column.key === 'permissions'">
                <a-select
                  v-model:value="record.permissions"
                  mode="multiple"
                  style="width: 100%"
                  placeholder="请选择权限"
                  :options="permissionOptions"
                />
              </template>
              <template v-else-if="column.key === 'action'">
                <a-button type="link" danger @click="removeDeveloper(index)"
                  >删除</a-button
                >
              </template>
            </template>
          </a-table>
        </div>
      </a-form-item>

      <!-- 备注信息部分 -->
      <a-form-item
        label="备注信息"
        name="remarks"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 21 }"
      >
        <a-textarea
          v-model:value="formState.remarks"
          :rows="4"
          placeholder="请输入备注信息"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
.developers-table-wrapper {
  background: #fafafa;
  padding: 16px;
  border-radius: 4px;
}
</style>
