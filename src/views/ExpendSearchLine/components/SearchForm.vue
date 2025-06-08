<!-- SearchForm.vue -->
<template>
  <div class="search-form">
    <a-form
      ref="formRef"
      :model="formState"
      @finish="onFinish"
      layout="vertical"
    >
      <a-row :gutter="24">
        <!-- 始终显示的表单项 -->
        <a-col :span="6">
          <a-form-item name="name" label="用户名">
            <a-input
              v-model:value="formState.name"
              placeholder="请输入用户名"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="phone" label="手机号">
            <a-input
              v-model:value="formState.phone"
              placeholder="请输入手机号"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="status" label="状态">
            <a-select v-model:value="formState.status" placeholder="请选择状态">
              <a-select-option value="1">启用</a-select-option>
              <a-select-option value="0">禁用</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <!-- 可展开/收起的表单项 -->
        <template v-if="expanded">
          <a-col :span="6">
            <a-form-item name="email" label="邮箱">
              <a-input
                v-model:value="formState.email"
                placeholder="请输入邮箱"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item name="department" label="部门">
              <a-select
                v-model:value="formState.department"
                placeholder="请选择部门"
              >
                <a-select-option value="dev">研发部</a-select-option>
                <a-select-option value="sales">销售部</a-select-option>
                <a-select-option value="hr">人事部</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item name="role" label="角色">
              <a-select v-model:value="formState.role" placeholder="请选择角色">
                <a-select-option value="admin">管理员</a-select-option>
                <a-select-option value="user">普通用户</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item name="createTime" label="创建时间">
              <a-range-picker v-model:value="formState.createTime" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item name="type" label="用户类型">
              <a-select
                v-model:value="formState.type"
                placeholder="请选择用户类型"
              >
                <a-select-option value="1">个人用户</a-select-option>
                <a-select-option value="2">企业用户</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item name="level" label="用户等级">
              <a-select
                v-model:value="formState.level"
                placeholder="请选择用户等级"
              >
                <a-select-option value="1">普通会员</a-select-option>
                <a-select-option value="2">高级会员</a-select-option>
                <a-select-option value="3">VIP会员</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </template>
      </a-row>

      <!-- 操作按钮 -->
      <div class="table-page-search-submitButtons">
        <a-space>
          <a-button type="primary" html-type="submit">查询</a-button>
          <a-button @click="resetForm">重置</a-button>
          <a @click="toggleExpand">
            {{ expanded ? '收起' : '展开' }}
            <component :is="expanded ? 'UpOutlined' : 'DownOutlined'" />
          </a>
        </a-space>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { UpOutlined, DownOutlined } from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'

interface FormState {
  name: string
  phone: string
  status: string
  email: string
  department: string
  role: string
  createTime: [Date, Date] | null
  type: string
  level: string
}

export default defineComponent({
  components: {
    UpOutlined,
    DownOutlined
  },
  setup() {
    const formRef = ref<FormInstance>()
    const expanded = ref<boolean>(false)

    const formState = reactive<FormState>({
      name: '',
      phone: '',
      status: '',
      email: '',
      department: '',
      role: '',
      createTime: null,
      type: '',
      level: ''
    })

    const toggleExpand = () => {
      expanded.value = !expanded.value
    }

    const resetForm = () => {
      formRef.value?.resetFields()
    }

    const onFinish = (values: FormState) => {
      console.log('Form values:', values)
      // 这里处理表单提交逻辑
    }

    return {
      formRef,
      formState,
      expanded,
      toggleExpand,
      resetForm,
      onFinish
    }
  }
})
</script>

<style scoped>
.search-form {
  padding: 24px;
  background: #fff;
  margin-bottom: 16px;
}

.table-page-search-submitButtons {
  margin-top: 24px;
  margin-bottom: 24px;
  text-align: right;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
