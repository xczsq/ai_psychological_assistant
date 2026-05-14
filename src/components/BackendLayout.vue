<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <el-aside :width="isCollapsed ? '64px' : '264px'">
        <Sidebar />
      </el-aside>
      <el-container>
        <el-header>
          <Navbar />
        </el-header>
        <el-main class="main-content">
          <router-view class="content-container" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import Sidebar from './Sidebar.vue'
import Navbar from './navbar.vue'
import { useAdminStore } from '@/stores/admin'

const isCollapsed = computed(() => {
  return useAdminStore().isCollapsed
})
</script>
<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .el-header {
    height: 74px !important;
  }
  .main-container {
    height: 100%;
    .content-container {
      padding: 20px;
      background-color: #fff;
      min-height: calc(100% - 74px);
    }
  }
  .el-aside {
    height: 100%;
  }
}
</style>
