<script setup lang="ts">
import { AnnouncementApi } from '~/api/announcement'
import type { HomeAnnouncementVO } from '~/types/announcement'

/* ==================== 状态管理 ==================== */
const announcements = ref<HomeAnnouncementVO[]>([])
const currentIndex = ref(0)
const isPaused = ref(false)

/* ==================== 计算属性 ==================== */
const currentAnnouncement = computed(() => {
  return announcements.value[currentIndex.value] || null
})

const hasUnread = computed(() => {
  return announcements.value.length > 0
})

/* ==================== 方法 ==================== */
const loadAnnouncements = async () => {
  try {
    const data = await AnnouncementApi.getHomeAnnouncements()
    announcements.value = data || []
  } catch (e) {
    console.error(e)
  }
}

const nextAnnouncement = () => {
  if (announcements.value.length <= 1) return
  currentIndex.value = (currentIndex.value + 1) % announcements.value.length
}

const prevAnnouncement = () => {
  if (announcements.value.length <= 1) return
  currentIndex.value = (currentIndex.value - 1 + announcements.value.length) % announcements.value.length
}

const goToDetail = () => {
  if (currentAnnouncement.value) {
    navigateTo(`/announcement/${currentAnnouncement.value.id}`)
  }
}

const goToList = () => {
  navigateTo('/announcement')
}

/* 自动轮播 */
let timer: number | null = null

const startAutoPlay = () => {
  if (timer) return
  timer = window.setInterval(() => {
    if (!isPaused.value) {
      nextAnnouncement()
    }
  }, 5000)
}

const stopAutoPlay = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const handleMouseEnter = () => {
  isPaused.value = true
}

const handleMouseLeave = () => {
  isPaused.value = false
}

onMounted(() => {
  loadAnnouncements()
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <div
    v-if="hasUnread"
    class="announcement-bar"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="bar-container">
      <!-- 左侧图标 -->
      <div class="bar-icon">
        <Icon name="ep:megaphone" />
        <span v-if="announcements.length > 1" class="announcement-count">
          {{ announcements.length }}
        </span>
      </div>

      <!-- 中间内容 -->
      <div class="bar-content" @click="goToDetail">
        <div v-if="currentAnnouncement" class="announcement-item">
          <span v-if="currentAnnouncement.isTop" class="top-tag">置顶</span>
          <span class="announcement-text">{{ currentAnnouncement.title }}</span>
          <Icon name="ep:arrow-right" class="arrow-icon" />
        </div>
      </div>

      <!-- 右侧操作 -->
      <div class="bar-actions">
        <!-- 切换按钮（多条公告时显示） -->
        <template v-if="announcements.length > 1">
          <button class="action-btn nav-btn" @click.stop="prevAnnouncement">
            <Icon name="ep:arrow-up" />
          </button>
          <button class="action-btn nav-btn" @click.stop="nextAnnouncement">
            <Icon name="ep:arrow-down" />
          </button>
        </template>

        <!-- 查看更多 -->
        <button class="action-btn more-btn" @click.stop="goToList">
          <span>更多</span>
          <Icon name="ep:arrow-right" />
        </button>

        <!-- 关闭按钮 -->
        <button class="action-btn close-btn" @click.stop="hasUnread = false">
          <Icon name="ep:close" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 公告栏 */
.announcement-bar {
  background: linear-gradient(90deg, #fff8e6 0%, #fff 50%, #fff8e6 100%);
  border-bottom: 1px solid #ffe4b3;
}

.bar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 左侧图标 */
.bar-icon {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  color: #e6a23c;
  flex-shrink: 0;
}

.announcement-count {
  padding: 2px 6px;
  background: #e6a23c;
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

/* 中间内容 */
.bar-content {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.announcement-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.top-tag {
  padding: 2px 6px;
  background: #f56c6c;
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  flex-shrink: 0;
}

.announcement-text {
  flex: 1;
  font-size: 14px;
  color: var(--color-text-primary, #303133);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bar-content:hover .announcement-text {
  color: var(--el-color-primary, #409eff);
}

.arrow-icon {
  font-size: 14px;
  color: var(--color-text-secondary, #909399);
  flex-shrink: 0;
}

/* 右侧操作 */
.bar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-size: 13px;
  color: var(--color-text-secondary, #909399);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--color-text-primary, #303133);
}

.nav-btn {
  padding: 6px;
  font-size: 12px;
}

.more-btn {
  color: var(--el-color-primary, #409eff);
}

.more-btn:hover {
  background: var(--el-color-primary-light-9, #ecf5ff);
  color: var(--el-color-primary, #409eff);
}

.close-btn {
  padding: 6px;
  font-size: 14px;
}

.close-btn:hover {
  background: #fef0f0;
  color: #f56c6c;
}

/* 响应式 */
@media (max-width: 768px) {
  .bar-container {
    padding: 0 16px;
    height: 40px;
  }

  .nav-btn {
    display: none;
  }

  .more-btn span {
    display: none;
  }
}
</style>
