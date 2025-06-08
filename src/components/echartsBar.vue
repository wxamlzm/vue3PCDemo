<template>
  <div ref="chartRef" style="width: 600px; height: 400px"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as echarts from 'echarts'

interface ChartDataItem {
  completedPercentage: string
  nostartedPercentage: string
  progressPercentage: string
  group: string
}

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const rawData: ChartDataItem[] = [
  {
    completedCount: 3000,
    completedPercentage: '49.98%',
    nostartedCount: 3002,
    nostartedPercentage: '50.02%',
    progressCount: 0,
    progressPercentage: '0.00%',
    group: 'type1'
  },
  {
    completedCount: 4264,
    completedPercentage: '49.98%',
    nostartedCount: 4267,
    nostartedPercentage: '50.02%',
    progressCount: 0,
    progressPercentage: '0.00%',
    group: 'type2'
  },
  {
    completedCount: 1214,
    completedPercentage: '50%',
    nostartedCount: 1215,
    nostartedPercentage: '50%',
    progressCount: 0,
    progressPercentage: '0.00%',
    group: 'type3'
  }
]

const processData = (data: ChartDataItem[]) => {
  return data.map(item => ({
    completed: parseFloat(item.completedPercentage),
    nostarted: parseFloat(item.nostartedPercentage),
    progress: parseFloat(item.progressPercentage),
    group: item.group
  }))
}

const initChart = () => {
  if (!chartRef.value) return

  const processedData = processData(rawData)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['已完成', '未开始', '进行中']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: processedData.map(item => item.group)
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '已完成',
        type: 'bar',
        stack: 'total',
        data: processedData.map(item => item.completed),
        itemStyle: { color: '#91cc75' }
      },
      {
        name: '未开始',
        type: 'bar',
        stack: 'total',
        data: processedData.map(item => item.nostarted),
        itemStyle: { color: '#eee' }
      },
      {
        name: '进行中',
        type: 'bar',
        stack: 'total',
        data: processedData.map(item => item.progress),
        itemStyle: { color: '#5470c6' }
      }
    ]
  }

  chart = echarts.init(chartRef.value)
  chart.setOption(option)

  // 响应窗口变化
  window.addEventListener('resize', () => chart?.resize())
}

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chart) {
    chart.dispose()
    window.removeEventListener('resize', () => chart?.resize())
  }
})
</script>
