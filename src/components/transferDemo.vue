<template>
  <a-transfer
    v-model:target-keys="targetKeys"
    class="tree-transfer"
    :data-source="dataSource"
    :render="item => item.title"
    :show-select-all="false"
    :one-way="true"
    :select-all-labels="selectAllLabels"
  >
    <template #children="{ direction, selectedKeys, onItemSelect }">
      <a-tree
        v-if="direction === 'left'"
        block-node
        checkable
        check-strictly
        default-expand-all
        :checked-keys="[...selectedKeys, ...targetKeys]"
        :tree-data="treeData"
        @check="
          (_, props) => {
            onChecked(props, [...selectedKeys, ...targetKeys], onItemSelect)
          }
        "
        @select="
          (_, props) => {
            onChecked(props, [...selectedKeys, ...targetKeys], onItemSelect)
          }
        "
      ></a-tree>
    </template>
  </a-transfer>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import type { TransferProps, TreeProps } from 'ant-design-vue'
const tData = ref<TransferProps['dataSource']>([
  { key: 'doctor', title: '医生', disableCheckbox: true, children: [] },
  { key: 'nurse', title: '护士', disableCheckbox: true, children: [] }
])

const transferDataSource = []
const dataSource = ref(transferDataSource)
function flatten(list: TransferProps['dataSource'] = []) {
  list.forEach(item => {
    transferDataSource.push(item)
    flatten(item.children)
  })
}

function isChecked(
  selectedKeys: (string | number)[],
  eventKey: string | number
) {
  return selectedKeys.indexOf(eventKey) !== -1
}

function handleTreeData(
  treeNodes: TransferProps['dataSource'],
  targetKeys: string[] = []
) {
  return treeNodes?.map(({ children, ...props }) => ({
    ...props,
    disabled: targetKeys.includes(props.key as string),
    children: handleTreeData(children ?? [], targetKeys)
  }))
}

const targetKeys = ref<string[]>([])

const treeData = computed(() => {
  return handleTreeData(tData.value, targetKeys.value)
})

const onChecked = (
  e: Parameters<TreeProps['onCheck']>[1] | Parameters<TreeProps['onSelect']>[1],
  checkedKeys: string[],
  onItemSelect: (n: any, c: boolean) => void
) => {
  const { eventKey } = e.node
  onItemSelect(eventKey, !isChecked(checkedKeys, eventKey))
}

const selectAllLabels = [
  ({ selectedCount, totalCount }) => `${selectedCount}/${totalCount}`,
  ({ selectedCount, totalCount }) => `${selectedCount}/${totalCount}`
]

onMounted(() => {
  const arr = [
    { key: 'test1', title: '测试1', type: 1 },
    { key: 'test2', title: '测试2', type: 1 },
    { key: 'test3', title: '测试3', type: 2 },
    { key: 'test4', title: '测试4', type: 2 }
  ]

  arr.forEach(item => {
    if (item.type === 1) {
      tData.value!.at(0)!.children.push(item)
    } else {
      tData.value!.at(1)!.children.push(item)
    }
  })

  flatten(JSON.parse(JSON.stringify(tData.value)))
})
</script>
