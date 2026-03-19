<template>
  <NuxtLayout name="member">
    <div class="messages-page">
      <!-- 页面标题 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Icon name="ep:bell" :size="28" class="text-blue-600" />
          消息中心
        </h1>
        <p class="text-gray-500 mt-1">管理您的消息通知</p>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <!-- 未读消息 -->
        <div class="stat-card bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">未读消息</p>
              <p class="text-2xl font-bold text-red-500">{{ stats?.unread || 0 }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <Icon name="ep:bell" class="text-red-500" :size="24" />
            </div>
          </div>
        </div>

        <!-- 系统消息 -->
        <div class="stat-card bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">系统消息</p>
              <p class="text-2xl font-bold text-blue-500">{{ stats?.system || 0 }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Icon name="ep:monitor" class="text-blue-500" :size="24" />
            </div>
          </div>
        </div>

        <!-- 订单消息 -->
        <div class="stat-card bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">订单消息</p>
              <p class="text-2xl font-bold text-amber-500">{{ stats?.order || 0 }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Icon name="ep:shopping-bag" class="text-amber-500" :size="24" />
            </div>
          </div>
        </div>

        <!-- 活动消息 -->
        <div class="stat-card bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">活动消息</p>
              <p class="text-2xl font-bold text-purple-500">{{ stats?.activity || 0 }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Icon name="ep:gift" class="text-purple-500" :size="24" />
            </div>
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <el-tabs v-model="activeTab" class="messages-tabs" type="border-card">
        <!-- 消息列表 -->
        <el-tab-pane label="消息列表" name="list">
          <template #label>
            <span class="flex items-center gap-1">
              <Icon name="ep:message" :size="16" />
              消息列表
            </span>
          </template>
          <NotificationList />
        </el-tab-pane>

        <!-- 消息设置 -->
        <el-tab-pane label="消息设置" name="settings">
          <template #label>
            <span class="flex items-center gap-1">
              <Icon name="ep:setting" :size="16" />
              消息设置
            </span>
          </template>
          <NotificationSettings />
        </el-tab-pane>
      </el-tabs>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/stores/notification'

const notificationStore = useNotificationStore()

const activeTab = ref('list')

const { stats } = storeToRefs(notificationStore)

/* ==================== 页面Meta ==================== */
useHead({
  title: '消息中心 - 学次元'
})

definePageMeta({
  name: 'messages',
  middleware: ['auth']
})

/* ==================== 初始化 ==================== */
onMounted(() => {
  notificationStore.fetchStats()
})
</script>

<style scoped>
.messages-page {
  min-height: 600px;
}

.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.messages-tabs {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}
</style>
