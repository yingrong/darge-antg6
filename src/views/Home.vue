<template>
  <div class="home">
    <a-layout>
      <a-layout-header class="header">
        <div class="logo" />
        <a-menu
          v-model:selectedKeys="selectedKeys"
          theme="dark"
          mode="horizontal"
          :style="{ lineHeight: '64px' }"
        >
          <a-menu-item key="1">首页</a-menu-item>
          <a-menu-item key="2">功能</a-menu-item>
          <a-menu-item key="3">关于</a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout-content style="padding: 0 50px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>首页</a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
          欢迎使用
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        ©2024 Created by Your Company
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const selectedKeys = ref(['1'])
</script>

<style scoped>
.home {
  height: 100vh;
}
.header {
  display: flex;
  align-items: center;
}
.logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
}
</style>
