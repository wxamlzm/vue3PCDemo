<template>
  <div ref="containerRef" class="echarts-container"></div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted, nextTick, shallowRef } from 'vue'
import { debounce } from 'lodash-es'
import * as echarts from 'echarts'
import type { ECharts, EChartsOption, SetOptionOpts } from 'echarts'
// 定义 props 接口
interface EChartsContainerProps {
  /** ECharts 配置项 (必传) */
  option: EChartsOption
  /** 初始化附加参数 */
  initOptions?: {
    devicePixelRatio?: number
    renderer?: 'canvas' | 'svg'
    width?: number | string
    height?: number | string
    locale?: string
  }
  /** 主题配置 (字符串或主题对象) */
  theme?: string | object
  /** 是否显示加载状态 */
  loading?: boolean
  /** 窗口 resize 防抖时间 (毫秒) */
  resizeDebounce?: number
  /** setOption 配置 */
  setOptionOpts?: SetOptionOpts
}
const props = withDefaults(defineProps<EChartsContainerProps>(), {
  initOptions: () => ({}),
  theme: null,
  loading: false,
  resizeDebounce: 300,
  setOptionOpts: () => ({})
})
const emit = defineEmits(['init', 'resize'])
const containerRef = ref<HTMLElement>()
// 核心修改：使用 shallowRef 替代 ref 来存储 ECharts 实例
const chartRef = shallowRef<ECharts>()
let observer: ResizeObserver | null = null
// 初始化图表
const initChart = () => {
  if (!containerRef.value) return
  // 清理已有实例
  if (chartRef.value) {
    chartRef.value.dispose()
  }
  // 创建实例
  chartRef.value = echarts.init(
    containerRef.value,
    props.theme,
    props.initOptions
  )
  chartRef.value.setOption(props.option, props.setOptionOpts)
  // 处理加载状态
  props.loading ? chartRef.value.showLoading() : chartRef.value.hideLoading()
  // 触发初始化事件
  emit('init', chartRef.value)
}
// 响应式处理
const resizeHandler = debounce(() => {
  // 增强安全检查
  if (
    chartRef.value &&
    !chartRef.value.isDisposed() &&
    containerRef.value &&
    containerRef.value.clientWidth > 0 &&
    containerRef.value.clientHeight > 0
  ) {
    try {
      chartRef.value.resize()
      emit('resize')
    } catch (err) {
      console.error('ECharts resize error:', err)
    }
  }
}, props.resizeDebounce)
// 监听容器变化
const initResizeObserver = () => {
  if (!containerRef.value) return
  observer = new ResizeObserver(resizeHandler)
  observer.observe(containerRef.value)
}
// 销毁监听器
const destroyResizeObserver = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}
// 暴露实例方法
const getEchartsInstance = () => chartRef.value
// 生命周期
onMounted(() => {
  nextTick(() => {
    // 增加短暂延迟确保 DOM 完全就绪
    setTimeout(() => {
      initChart()
      initResizeObserver()
    }, 50)
  })
})
onUnmounted(() => {
  destroyResizeObserver()
  if (chartRef.value && !chartRef.value.isDisposed()) {
    chartRef.value.dispose()
  }
})
// 监听配置变化
watch(
  () => props.option,
  newOption => {
    if (chartRef.value && !chartRef.value.isDisposed()) {
      try {
        // 使用深拷贝避免潜在的引用问题
        const clonedOption = JSON.parse(JSON.stringify(newOption))
        chartRef.value.setOption(clonedOption, props.setOptionOpts)
      } catch (err) {
        console.error('ECharts setOption error:', err)
      }
    }
  },
  { deep: true }
)
// 监听加载状态
watch(
  () => props.loading,
  loading => {
    if (!chartRef.value) return
    loading ? chartRef.value.showLoading() : chartRef.value.hideLoading()
  }
)
// 暴露实例
defineExpose({
  getEchartsInstance
})
</script>
<style scoped>
.echarts-container {
  width: 100%;
  height: 100%;
  min-height: 300px; /* 防止容器高度坍塌 */
}
</style>
