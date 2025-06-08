<template>
  <a-table
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content', y: 500 }"
    bordered
    row-key="uniqueKey"
  >
  </a-table>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { TableColumnType } from 'ant-design-vue';

interface TableItem {
  category: string;
  key: string;
  value: any;
  uniqueKey: string;
}

const fixedKeys = [
  { key: '姓名', category: '个人信息' },
  { key: '年龄', category: '个人信息' },
  { key: '爱好', category: '个人信息' },
  { key: '地址', category: '' }
];

const columns: TableColumnType[] = [
  {
    title: '分类',
    dataIndex: 'category',
    fixed: 'left',
    width: 120,
    customCell: (record: TableItem, rowIndex: number) => {
      // 地址行（category为空的行）
      if (!record.category) {
        return { colSpan: 2 };
      }
      
      // 同一分类的第一行
      if (rowIndex === 0 || tableData.value[rowIndex - 1].category !== record.category) {
        let count = 1;
        let i = rowIndex + 1;
        while (i < tableData.value.length && tableData.value[i].category === record.category) {
          count++;
          i++;
        }
        return { rowSpan: count };
      }
      
      // 同一分类的后续行
      return { rowSpan: 0 };
    }
  },
  {
    title: 'Key',
    dataIndex: 'key',
    fixed: 'left',
    width: 120,
    customCell: (record: TableItem) => {
      // 地址行（category为空的行）
      if (!record.category) {
        return { colSpan: 0 };
      }
      
      // 数组值的处理
      const sameKeyIndex = tableData.value.findIndex(item => item.key === record.key);
      const currentIndex = tableData.value.findIndex(item => item.uniqueKey === record.uniqueKey);
      
      if (sameKeyIndex !== currentIndex) {
        return { rowSpan: 0 };
      }
      
      const valuesWithSameKey = tableData.value.filter(item => item.key === record.key);
      return { rowSpan: valuesWithSameKey.length };
    }
  },
  {
    title: 'Value',
    dataIndex: 'value'
  }
];

const tableData = ref<TableItem[]>([]);

const mockBackendData = {
  '姓名': '张三',
  '爱好': ['篮球', '音乐', '旅游'],
  '地址': '北京市'
};

function processData(backendData: Record<string, any>) {
  const result: TableItem[] = [];
  
  fixedKeys.forEach(({ key, category }) => {
    const rawValue = backendData[key] ?? '';
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    
    values.forEach((value, index) => {
      // 如果是地址行，直接在category字段中放入key的值
      const displayCategory = !category ? key : category;
      
      result.push({
        // 对于地址行，category中存放"地址"文本，但保留空category标记
        category: displayCategory,
        key,
        value,
        uniqueKey: `${key}_${index}`
      });
    });
  });
  
  // 重新处理，确保地址行的category为空（用于标识）
  // 但显示时会用到displayCategory
  result.forEach(item => {
    if (item.key === '地址') {
      Object.defineProperty(item, 'displayCategory', {
        value: item.category,
        enumerable: false
      });
      item.category = '';
    }
  });
  
  return result;
}

tableData.value = processData(mockBackendData);
</script>