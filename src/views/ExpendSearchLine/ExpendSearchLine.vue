<!-- UserList.vue -->
<template>
  <div class="user-list-container">
    <!-- 引入搜索表单组件 -->
    <search-form @search="handleSearch" />

    <!-- 表格部分 -->
    <a-card
      :bordered="false"
      class="table-card"
      :class="{ 'table-card-expanded': expanded }"
    >
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: 1300 }"
      >
        <!-- 用户名列 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <a @click="handleNameClick(record)">{{ record.name }}</a>
          </template>

          <!-- 状态列 -->
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="record.status === '1' ? 'green' : 'red'">
              {{ record.status === '1' ? '启用' : '禁用' }}
            </a-tag>
          </template>

          <!-- 操作列 -->
          <template v-else-if="column.dataIndex === 'action'">
            <a-space>
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确定要删除这条记录吗？"
                @confirm="handleDelete(record)"
              >
                <a class="delete-link">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import SearchForm from './components/SearchForm.vue'
import type { TableColumnsType } from 'ant-design-vue'

// 响应式状态
const loading = ref<boolean>(false)
const expanded = ref<boolean>(false)

// 表格列定义
const columns: TableColumnsType = [
  {
    title: '用户名',
    dataIndex: 'name',
    width: 120,
    fixed: 'left'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 120
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 180
  },
  {
    title: '部门',
    dataIndex: 'department',
    width: 120
  },
  {
    title: '角色',
    dataIndex: 'role',
    width: 120
  },
  {
    title: '用户类型',
    dataIndex: 'type',
    width: 120
  },
  {
    title: '用户等级',
    dataIndex: 'level',
    width: 120
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 120
  }
]

// 分页配置
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true
})

// 处理搜索事件
const handleSearch = (values: any) => {
  console.log('Search values:', values)
  // 这里处理搜索逻辑
}
</script>

<style lang="scss" scoped>
.user-list-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
}

.table-card {
  transition: margin-top 0.3s ease;

  // 搜索栏展开时，增加上边距
  &-expanded {
    margin-top: 16px;
  }

  :deep(.ant-card-body) {
    padding: 0;
  }

  :deep(.ant-table-wrapper) {
    .ant-table {
      .ant-table-title {
        padding: 16px 24px;
      }

      .ant-table-tbody {
        tr {
          td {
            // 调整单元格内边距
            padding: 12px 16px;

            // 操作列样式
            .delete-link {
              color: #ff4d4f;

              &:hover {
                color: #ff7875;
              }
            }
          }

          &:hover {
            // 鼠标悬停效果
            td {
              background: #fafafa;
            }
          }
        }
      }
    }

    // 分页样式调整
    .ant-pagination {
      margin: 16px 24px;
    }
  }
}

// 响应式调整
@media screen and (max-width: 768px) {
  .user-list-container {
    padding: 12px;
  }

  .table-card {
    :deep(.ant-table-wrapper) {
      .ant-table {
        .ant-table-tbody {
          tr {
            td {
              padding: 8px 12px;
            }
          }
        }
      }
    }
  }
}
</style>
