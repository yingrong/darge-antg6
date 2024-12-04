<template>
  <div class="back-link">
    <router-link to="/">返回首页</router-link>
  </div>
  <div>
    <div id="container"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { Graph } from '@antv/g6'

let graph: any = null

// 初始化数据
const data = {
  nodes: [
    { id: 'node1', label: '指标1' },
    { id: 'node2', label: '指标2' },
  ],
  edges: [
    { source: 'node1', target: 'node2' },
  ],
}

onMounted(() => {
  const container = document.getElementById('container')
  const width = container?.scrollWidth || 800
  const height = container?.scrollHeight || 600

  // 创建图实例
  graph = new Graph({
    container: 'container',
    width,
    height,
    // 启用节点分组功能
    groupByTypes: true,
    // 默认节点配置
    defaultNode: {
      size: [80, 40],
      type: 'rect',
      style: {
        fill: '#DEE9FF',
        stroke: '#5B8FF9',
      },
    },
    // 默认边配置
    defaultEdge: {
      type: 'line',
      style: {
        stroke: '#91d5ff',
      },
    },
    // 布局配置
    layout: {
      type: 'dagre',
      rankdir: 'TB',
      align: 'DL',
      nodesep: 20,
      ranksep: 50,
    },
    // 内置交互
    modes: {
      default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
    },
    data
  })

  // 加载数据
  // graph.data(data)
  // 渲染图
  graph.render()

  // 自适应窗口大小
  window.addEventListener('resize', () => {
    if (!graph || graph.get('destroyed')) return
    const container = document.getElementById('container')
    if (!container) return
    graph.changeSize(container.scrollWidth, container.scrollHeight)
  })
})

onUnmounted(() => {
  if (graph) {
    graph.destroy()
  }
})
</script>

<style scoped>
.back-link {
  padding: 16px;
}
#container {
  width: 100%;
  height: calc(100vh - 100px);
  border: 1px solid #ddd;
}
</style>