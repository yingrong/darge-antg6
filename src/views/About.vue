<template>
  <div class="about">
    <h1>关于我们</h1>
    <div class="content">
      <p>这是一个基于 Vue.js 开发的流程图可视化工具，使用 Dagre 布局引擎实现自动布局功能。</p>
      <h2>主要功能</h2>
      <ul>
        <li>自动布局的流程图展示</li>
        <li>支持节点和边的自定义样式</li>
        <li>流程图的缩放和拖拽</li>
      </ul>
      <div class="back-link">
        <router-link to="/">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const selectedKeys = ref(['1'])
</script>

<style scoped>
.about {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin: 1.5rem 0 1rem;
}

ul {
  padding-left: 1.5rem;
}

li {
  margin: 0.5rem 0;
  color: #34495e;
}

.back-link {
  margin-top: 2rem;
  text-align: center;
}

.back-link a {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>
