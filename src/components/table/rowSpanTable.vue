<template>
  <a-table :columns="columns" :dataSource="dataSource" bordered></a-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    customRender: ({ text, record, index }) => {
      return {
        children: text,
        attrs: { rowSpan: index === 0 ? dataSource.value.length : 0 }
      }
    }
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  }
]

const dataSource = ref([
  {key: '1', name: 'tt', age: 1},
  {key: '2', name: 'tt1', age: 1},
  {key: '3', name: 'tt2', age: 1},
])
</script>
