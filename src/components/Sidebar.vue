<template>
  <el-menu
    :collapse="isCollapsed"
    :collapse-transition="false"
    default-active="2"
    class="menu-style"
  >
    <div class="brand">
      <el-image style="width: 50px; height: 50px; margin-right: 10px;" :src="iconUrl" alt="logo" fit="contain" />
      <div v-show="!isCollapsed" class="info-card">
        <h1 class="brand-title">心理健康ai助手</h1>
        <p class="brand-subtitle">管理后台</p>
      </div>
    </div>
    <el-menu-item @click="selectMenu(item)" v-for="item in menuRoutes" :key="item.path" :index="item.path">
      <el-icon><component :is="iconMap[item.meta.icon]" /></el-icon>
      <span>{{ item.meta.title }}</span>
    </el-menu-item>
  </el-menu>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PieChart, ChatLineSquare, Message, User } from '@element-plus/icons-vue'
import { useAdminStore } from '@/stores/admin'

const iconUrl = new URL('@/assets/images/机器人.png', import.meta.url).href
const router = useRouter()
const route = useRoute()

const isCollapsed = computed(() => {
  return useAdminStore().isCollapsed
})

const menuRoutes = computed(() => {
  return router.getRoutes().find(r => r.path === '/back')?.children || []
})

const iconMap = {
  PieChart,
  ChatLineSquare,
  Message,
  User
}

const selectMenu = (item) => {
  router.push(`/back/${item.path}`)
}

</script>
<style lang="scss" scoped>
.menu-style {
  height: 100%;
  .brand {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  .info-card {
    .brand-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
      color: #1f2937;
    }
    .brand-subtitle {
      font-size:14px;
      color: #6b7280;
    }
  }
}
}
</style>