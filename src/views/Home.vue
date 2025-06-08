<template>
  <div class="chart-container">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

// 图表DOM引用
const chartRef = ref<HTMLElement | null>(null);
// 图表实例引用
let chartInstance: echarts.ECharts | null = null;

// 定义固定的颜色对象，这样在itemStyle和tooltip中使用相同的颜色引用
const colorConfig = {
  typeA: {
    // 渐变色用于柱状图
    gradient: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: '#0499FA' },
      { offset: 1, color: 'rgba(1, 155, 252, 0.1)' }
    ]),
    // 固定色用于tooltip标记
    solid: '#0499FA'
  },
  typeB: {
    gradient: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: '#FFD666' },
      { offset: 1, color: 'rgba(255, 214, 102, 0.1)' }
    ]),
    solid: '#FFD666'
  },
  typeC: {
    gradient: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: '#39BB88' },
      { offset: 1, color: '#5AD8A6' }
    ]),
    solid: '#39BB88'
  }
};

// 准备数据
const categories = ['一月', '二月', '三月', '四月', '五月', '六月'];
const seriesData = [
  {
    name: '类型A',
    data: [20, 35, 45, 30, 50, 25],
    colorKey: 'typeA'
  },
  {
    name: '类型B',
    data: [15, 20, 25, 35, 20, 30],
    colorKey: 'typeB'
  },
  {
    name: '类型C',
    data: [25, 15, 20, 25, 30, 40],
    colorKey: 'typeC'
  }
];

// 初始化图表方法
const initChart = () => {
  if (chartRef.value) {
    // 创建实例
    chartInstance = echarts.init(chartRef.value);
    
    // 配置项
    const option: EChartsOption = {
      title: {
        text: '渐变色柱状图示例',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          let result = `<div style="font-weight:bold">${params[0].name}</div>`;
          
          params.forEach((item: any) => {
            // 获取对应系列的colorKey
            const seriesIndex = item.seriesIndex;
            const colorKey = seriesData[seriesIndex].colorKey;
            // 使用固定的solid颜色作为标记
            const markerColor = colorConfig[colorKey as keyof typeof colorConfig].solid;
            
            result += `<div style="display:flex;align-items:center;margin:3px 0;">
                        <span style="display:inline-block;width:10px;height:10px;background:${markerColor};border-radius:50%;margin-right:5px;"></span>
                        <span>${item.seriesName}: ${item.value}</span>
                      </div>`;
          });
          
          return result;
        }
      },
      legend: {
        data: seriesData.map(item => item.name),
        top: 30
      },
      grid: {
        top: '15%',
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categories
      },
      yAxis: {
        type: 'value'
      },
      series: seriesData.map((item, index) => ({
        name: item.name,
        type: 'bar',
        barGap: '0%',
        emphasis: {
          focus: 'series'
        },
        data: item.data,
        itemStyle: {
          // 使用渐变色
          color: colorConfig[item.colorKey as keyof typeof colorConfig].gradient
        }
      }))
    };
    
    // 应用配置
    chartInstance.setOption(option);
    
    // 窗口大小变化时自动调整图表大小
    window.addEventListener('resize', handleResize);
  }
};

// 处理窗口大小变化
const handleResize = () => {
  chartInstance?.resize();
};

// 组件挂载后初始化图表
onMounted(() => {
  initChart();
});

// 组件卸载前清理
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  window.removeEventListener('resize', handleResize);
});
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