<template>
  <div class="back-link">
    <router-link to="/">返回首页</router-link>
  </div>
  <div class="upload-section">
    <button class="template-btn" @click="downloadTemplate">下载模板</button>
    <input type="file" accept=".xlsx,.xls" @change="handleFileUpload" />
  </div>
  <div>
    <div id="container"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { Graph } from '@antv/g6'
import { parseExcelToGraphData, generateExcelTemplate } from '../utils/excelParser'

let graph: any = null

// 初始化数据
const data = ref({
  nodes: [
    { id: 'node1', combo: 'dps1' , data: {label: 'kpi1'}},
    { id: 'node2', combo: 'dps1' , data: {label: 'kpi2'}},
    { id: 'node3', combo: 'dps3' , data: {label: 'kpi3'}},
  ],
  edges: [
    { source: 'node1', target: 'node2' },
    { source: 'node1', target: 'node3' },
  ],
  combos: [
    { id: 'dps1', label: 'dps1' },
    { id: 'dps3', label: 'dps3' },
  ]
})

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  try {
    const graphData = await parseExcelToGraphData(file)
    data.value = graphData
    console.log(graphData);
    if (graph) {
      // 清除现有数据
      // graph.clear();
      // 更新新数据
      graph.setData(graphData);
      // 重新执行渲染,此过程会执行数据更新、绘制元素、执行布局
      graph.render();

    }
  } catch (error) {
    console.error('Error parsing Excel file:', error)
  }
}

const downloadTemplate = () => {
  generateExcelTemplate();
};

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
    // groupByTypes: true,
    // 默认节点配置
    node: {
      type: 'html',
      style: {
        size: [100, 40],
        innerHTML: (d: { data: { location: any; label: any; ip: any; }; }) => {
          const {
            data: { location, label, ip },
          } = d;

          return `
            <div 
              style="
                width:100%; 
                height: 100%; 
                color: #646cff;
                user-select: none;
                display: flex; 
                padding: 10px;
                border-width: 1px;
                border-style: solid;
                "
            >
                <span>${label}</span>
            </div>`;
        },
      }
    },
    edge: {
      type: 'cubic-vertical',
      style: {
        endArrow: true,
      }
    },
    combo: {
      type: 'rect',
      style: {
        fill: '#fff',
        stroke: '#646cff',
        lineWidth: 2,
      }
    },
    // 布局配置
    layout: {
      type: 'antv-dagre',
      rankdir: 'TB',
      align: 'DL',
      nodesep: 20,
      ranksep: 50,
    },
    // 内置交互
    behaviors: ['drag-element', 'drag-canvas', 'zoom-canvas'],
    data: data.value
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

.upload-section {
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.template-btn {
  padding: 8px 16px;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.template-btn:hover {
  background-color: #747bff;
}

#container {
  width: 100%;
  height: calc(100vh - 150px);
  border: 1px solid #ddd;
}
</style>