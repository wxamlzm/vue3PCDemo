<template>
  <div class="chart-container">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 图表DOM引用
const chartRef = ref<HTMLElement | null>(null)
// 图表实例引用
let chartInstance: echarts.ECharts | null = null

// 数据类型定义
interface DataItem {
  name: string
  value: number
}

// 准备数据
const chartData: DataItem[] = [
  { name: '类别1', value: 20 },
  { name: '类别2', value: 50 },
  { name: '类别3', value: 80 },
  { name: '类别4', value: 30 },
  { name: '类别5', value: 60 },
  { name: '类别6', value: 90 }
]

// 初始化图表方法
const initChart = () => {
  if (chartRef.value) {
    // 创建实例
    chartInstance = echarts.init(chartRef.value)

    // 配置项
    const option: EChartsOption = {
      title: {
        text: '带渐变色的柱状图示例',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}'
      },
      visualMap: {
        type: 'piecewise',
        min: 0,
        max: 100,
        dimension: 1,
        pieces: [
          {
            min: 0,
            max: 30,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#0499FA' },
              { offset: 1, color: 'rgba(1, 155, 252, 0.1)' }
            ])
          },
          {
            min: 30,
            max: 60,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#FFD666' },
              { offset: 1, color: 'rgba(255, 214, 102, 0.1)' }
            ])
          },
          {
            min: 60,
            max: 100,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#39BB88' },
              { offset: 1, color: '#5AD8A6' }
            ])
          }
        ],
        show: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
        text: ['高', '低'],
        itemWidth: 15,
        itemHeight: 10
      },
      grid: {
        top: '10%',
        left: '3%',
        right: '3%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.map(item => item.name),
        axisLabel: {
          interval: 0,
          rotate: 0
        }
      },
      yAxis: {
        type: 'value',
        name: '数值'
      },
      series: [
        {
          name: '数据系列',
          type: 'bar',
          barWidth: '40%',
          data: chartData.map(item => item.value)
          // 不需要在这里设置itemStyle，由visualMap控制
        }
      ]
    }

    // 应用配置
    chartInstance.setOption(option)

    // 窗口大小变化时自动调整图表大小
    window.addEventListener('resize', handleResize)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  chartInstance?.resize()
}

// 组件挂载后初始化图表
onMounted(() => {
  initChart()
})

// 组件卸载前清理
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}

.chart {
  width: 100%;
  height: 400px;
}
</style>
