<template>
  <div>
    {{ overhaulCode }}
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { get, debounce } from 'lodash'

const overhaulCode = ref<string>('test1')
const overhaulCodeList = ref<string[]>([])
const isPolling = ref<boolean>(false)

let pollingInterval: number | null = null // 定时轮询时间目前为5分钟
const pollingIntervalTime = 5 * 60 * 1000

// 添加用于轮流展示code的轮询
let codeRotationInterval: number | null = null
const codeRotationIntervalTime = 5 * 60 * 1000
let currentCodeIndex = 0

// 请求数据
const fetchDataFromApi = async baseCode => {
  let result = []
  try {
    const res = await queryOverhaulCodes({ baseCode })
    result = get(res, 'overhaulCodes', [])
  } catch (err) {
    console.error(err)
  }
  return result
}

const fetchData = async () => {
  overhaulCodeList.value = await fetchDataFromApi('testValue')
  if (overhaulCodeList.value.length !== 0) {
    overhaulCode.value = overhaulCodeList.value[currentCodeIndex]
  }
}

const debouncedFetchData = debounce(fetchData, 300)

const fetchDataNow = () => {
  debouncedFetchData()
}

const startPolling = () => {
  if (isPolling.value) return

  isPolling.value = true

  fetchDataNow()

  const scheduleNextFetch = () => {
    pollingInterval = window.setTimeout(() => {
      fetchDataNow()
      scheduleNextFetch() // 递归调用以实现重复执行
    }, pollingIntervalTime)
  }

  scheduleNextFetch()
}

const rotateOverhaulCode = () => {
  // 确保列表不为空
  if (overhaulCodeList.value.length === 0) return

  // 更新索引，循环遍历列表
  currentCodeIndex = (currentCodeIndex + 1) % overhaulCodeList.value.length

  // 更新当前展示的code
  overhaulCode.value = overhaulCodeList.value[currentCodeIndex]
}

const startCodeRotation = () => {
  // 避免重复启动
  if (codeRotationInterval) return

  // 如果列表不为空，立即设置第一个元素
  if (overhaulCodeList.value.length > 0) {
    currentCodeIndex = 0
    overhaulCode.value = overhaulCodeList.value[currentCodeIndex]
  }

  const scheduleNextRotation = () => {
    codeRotationInterval = window.setTimeout(() => {
      rotateOverhaulCode()
      scheduleNextRotation() // 递归安排下一次轮询
    }, codeRotationIntervalTime)
  }

  scheduleNextRotation()
}

// 停止轮询的函数
const stopCodeRotation = () => {
  if (codeRotationInterval !== null) {
    window.clearTimeout(codeRotationInterval)
    codeRotationInterval = null
  }
}

// 在组件卸载时清理所有定时器
onUnmounted(() => {
  if (pollingInterval !== null) {
    window.clearTimeout(pollingInterval)
    pollingInterval = null
  }
  stopCodeRotation()
})

// 在组件挂载时启动轮询
onMounted(() => {
  startPolling()

  // 获取数据后启动轮转
  // 这里使用setTimeout确保fetchDataNow有足够时间完成
  setTimeout(() => {
    startCodeRotation()
  }, 1000) // 给fetchDataNow一秒的时间来获取数据
})
</script>
