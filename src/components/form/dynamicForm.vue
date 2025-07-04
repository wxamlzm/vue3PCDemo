<template>
  <div>
    <!-- 新增按钮 -->
    <a-button type="primary" @click="showModal"> 新增记录 </a-button>

    <!-- 主表单弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      title="新增记录"
      width="800px"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form
        :model="formData"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        ref="formRef"
      >
        <!-- 基础表单字段 -->
        <a-form-item
          label="项目名称"
          name="projectName"
          :rules="[{ required: true, message: '请输入项目名称' }]"
        >
          <a-input
            v-model:value="formData.projectName"
            placeholder="请输入项目名称"
          />
        </a-form-item>

        <a-form-item label="项目描述" name="description">
          <a-textarea
            v-model:value="formData.description"
            placeholder="请输入项目描述"
          />
        </a-form-item>

        <!-- 动态用户列表区域 -->
        <a-form-item label="用户列表" :wrapper-col="{ span: 24 }">
          <div class="user-list-container">
            <!-- 用户列表头部操作区 -->
            <div class="user-list-header">
              <a-button type="dashed" @click="addUser" icon="plus">
                添加用户
              </a-button>
              <span class="user-count">共 {{ userList.length }} 个用户</span>
            </div>

            <!-- 用户列表内容区 -->
            <div class="user-list-content">
              <div
                v-for="(user, index) in userList"
                :key="user.id"
                class="user-item"
              >
                <div class="user-item-header">
                  <span class="user-index">用户 {{ index + 1 }}</span>
                  <a-button
                    type="text"
                    danger
                    size="small"
                    @click="removeUser(index)"
                    v-if="userList.length > 1"
                  >
                    删除
                  </a-button>
                </div>

                <div class="user-item-content">
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item
                        :label="'姓名'"
                        :name="['userList', index, 'name']"
                        :rules="[{ required: true, message: '请输入姓名' }]"
                      >
                        <a-input
                          v-model:value="user.name"
                          placeholder="请输入姓名"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item
                        :label="'年龄'"
                        :name="['userList', index, 'age']"
                        :rules="[{ required: true, message: '请输入年龄' }]"
                      >
                        <a-input-number
                          v-model:value="user.age"
                          placeholder="请输入年龄"
                          :min="1"
                          :max="150"
                          style="width: 100%"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'

// 用户数据类型定义
interface User {
  id: string
  name: string
  age: number | null
}

// 主表单数据类型
interface FormData {
  projectName: string
  description: string
}

// 响应式数据
const modalVisible = ref(false)
const formRef = ref<FormInstance>()

// 主表单数据 - 独立管理
const formData = reactive<FormData>({
  projectName: '',
  description: ''
})

// 用户列表数据 - 独立管理
const userList = ref<User[]>([
  {
    id: generateId(),
    name: '',
    age: null
  }
])

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 显示弹窗
function showModal() {
  modalVisible.value = true
}

// 添加用户
function addUser() {
  userList.value.push({
    id: generateId(),
    name: '',
    age: null
  })
}

// 删除用户
function removeUser(index: number) {
  if (userList.value.length <= 1) {
    message.warning('至少需要保留一个用户')
    return
  }
  userList.value.splice(index, 1)
}

// 表单提交
async function handleSubmit() {
  try {
    // 验证表单
    await formRef.value?.validateFields()

    // 构造提交数据
    const submitData = {
      ...formData,
      userList: userList.value.filter(user => user.name && user.age) // 过滤空数据
    }

    console.log('提交数据:', submitData)

    // 这里调用你的API
    // await createRecord(submitData)

    message.success('新增成功')
    modalVisible.value = false
    resetForm()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 取消操作
function handleCancel() {
  modalVisible.value = false
  resetForm()
}

// 重置表单
function resetForm() {
  // 重置主表单
  Object.assign(formData, {
    projectName: '',
    description: ''
  })

  // 重置用户列表
  userList.value = [
    {
      id: generateId(),
      name: '',
      age: null
    }
  ]

  // 清空表单验证状态
  formRef.value?.resetFields()
}
</script>

<style scoped>
.user-list-container {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 16px;
  background-color: #fafafa;
}

.user-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.user-count {
  color: #666;
  font-size: 14px;
}

.user-list-content {
  max-height: 400px;
  overflow-y: auto;
}

.user-item {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 12px;
}

.user-item:last-child {
  margin-bottom: 0;
}

.user-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.user-index {
  font-weight: 500;
  color: #1890ff;
}

.user-item-content {
  margin-bottom: 0;
}

.user-item-content :deep(.ant-form-item) {
  margin-bottom: 0;
}

.user-item-content :deep(.ant-form-item-label) {
  font-size: 13px;
}
</style>
