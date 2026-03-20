<script setup lang="ts">
import { AnnouncementApi } from '~/api/announcement'
import type { AnnouncementVO, HomeAnnouncementVO } from '~/types/announcement'
import { AnnouncementTypeEnum } from '~/types/announcement'

useHead({
  title: '公告中心'
})

const message = useMessage()

/* ==================== 状态管理 ==================== */
const loading = ref(false)
const announcementList = ref<AnnouncementVO[]>([])
const homeAnnouncements = ref<HomeAnnouncementVO[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const activeType = ref<number | null>(null)

/* ==================== 计算属性 ==================== */
const typeOptions = [
  { value: null, label: '全部', icon: 'ep:notification' },
  { value: AnnouncementTypeEnum.SYSTEM, label: '系统公告', icon: 'ep:monitor' },
  { value: AnnouncementTypeEnum.ACTIVITY, label: '活动通知', icon: 'ep:present' },
  { value: AnnouncementTypeEnum.UPDATE, label: '更新日志', icon: 'ep:refresh' }
]

const getTypeLabel = (type: number) => {
  const option = typeOptions.find(o => o.value === type)
  return option?.label || '其他'
}

const getTypeTagClass = (type: number) => {
  switch (type) {
    case AnnouncementTypeEnum.SYSTEM:
      return 'type-system'
    case AnnouncementTypeEnum.ACTIVITY:
      return 'type-activity'
    case AnnouncementTypeEnum.UPDATE:
      return 'type-update'
    default:
      return 'type-other'
  }
}

/* ==================== 方法 ==================== */
const loadAnnouncements = async () => {
  loading.value = true
  try {
    const data = await AnnouncementApi.getAnnouncementList({
      type: activeType.value || undefined,
      pageNo: currentPage.value,
      pageSize: pageSize.value
    })
    announcementList.value = data.list || []
    total.value = data.total || 0
  } catch (e) {
    console.error(e)
    message.error('加载公告失败')
  } finally {
    loading.value = false
  }
}

const loadHomeAnnouncements = async () => {
  try {
    const data = await AnnouncementApi.getHomeAnnouncements()
    homeAnnouncements.value = data || []
  } catch (e) {
    console.error(e)
  }
}

const handleTypeChange = (type: number | null) => {
  activeType.value = type
  currentPage.value = 1
  loadAnnouncements()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadAnnouncements()
}

const goToDetail = (id: number) => {
  navigateTo(`/announcement/${id}`)
}

const formatDate = (timestamp: number) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  loadAnnouncements()
  loadHomeAnnouncements()
})
</script>

<template>
  <div class="announcement-page">
    <!-- 头部横幅 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <Icon name="ep:bullhorn" />
        </div>
        <div class="header-text">
          <h1 class="page-title">公告中心</h1>
          <p class="page-subtitle">了解最新动态、活动通知和系统更新</p>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- 重要公告滚动栏 -->
      <div v-if="homeAnnouncements.length > 0" class="top-announcements">
        <div class="top-label">
          <Icon name="ep:top" />
          <span>重要公告</span>
        </div>
        <div class="top-list">
          <div
            v-for="item in homeAnnouncements"
            :key="item.id"
            class="top-item"
            @click="goToDetail(item.id)"
          >
            <span v-if="item.isTop" class="top-badge">置顶</span>
            <span class="top-title">{{ item.title }}</span>
            <Icon name="ep:arrow-right" class="top-arrow" />
          </div>
        </div>
      </div>

      <!-- 类型筛选 -->
      <div class="filter-section">
        <div class="filter-tabs">
          <button
            v-for="option in typeOptions"
            :key="option.label"
            class="tab-btn"
            :class="{ active: activeType === option.value }"
            @click="handleTypeChange(option.value)"
          >
            <Icon :name="option.icon" class="tab-icon" />
            <span>{{ option.label }}</span>
          </button>
        </div>
      </div>

      <!-- 公告列表 -->
      <div v-loading="loading" class="announcement-list">
        <div
          v-for="item in announcementList"
          :key="item.id"
          class="announcement-card"
          @click="goToDetail(item.id)"
        >
          <div class="card-header">
            <div class="title-section">
              <span
                class="type-tag"
                :class="getTypeTagClass(item.type)"
              >
                {{ getTypeLabel(item.type) }}
              </span>
              <h3 class="announcement-title">
                <span v-if="item.isTop" class="top-mark">置顶</span>
                {{ item.title }}
              </h3>
            </div>
            <span class="publish-time">{{ formatDate(item.publishTime) }}</span>
          </div>

          <p class="announcement-summary">{{ item.summary }}</p>

          <div class="card-footer">
            <div class="view-count">
              <Icon name="ep:view" />
              <span>{{ item.viewCount }} 次浏览</span>
            </div>
            <div class="read-more">
              <span>查看详情</span>
              <Icon name="ep:arrow-right" />
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && announcementList.length === 0" class="empty-state">
        <div class="empty-icon">
          <Icon name="ep:document-delete" />
        </div>
        <p class="empty-title">暂无公告</p>
        <p class="empty-desc">敬请期待最新动态</p>
      </div>

      <!-- 分页 -->
      <div v-if="total > pageSize" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 页面基础 */
.announcement-page {
  min-height: 100vh;
  background-color: var(--color-bg-container, #f5f7fa);
}

/* 头部区域 */
.page-header {
  background: linear-gradient(135deg, var(--el-color-primary, #409eff) 0%, var(--el-color-primary-light-3, #66b1ff) 100%);
  padding: 48px 24px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

.header-text {
  color: white;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

/* 容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* 重要公告栏 */
.top-announcements {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  border: 1px solid var(--color-border, #e4e7ed);
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.top-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #f56c6c, #e6a23c);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
}

.top-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.top-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--color-bg-container, #f5f7fa);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.top-item:hover {
  background: var(--el-color-primary-light-9, #ecf5ff);
}

.top-badge {
  padding: 2px 8px;
  background: #f56c6c;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.top-title {
  flex: 1;
  font-size: 14px;
  color: var(--color-text-primary, #303133);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-arrow {
  font-size: 14px;
  color: var(--color-text-secondary, #909399);
}

/* 筛选区 */
.filter-section {
  margin-bottom: 24px;
}

.filter-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 1px solid var(--color-border, #e4e7ed);
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: var(--color-text-primary, #303133);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  border-color: var(--el-color-primary, #409eff);
  color: var(--el-color-primary, #409eff);
}

.tab-btn.active {
  background: var(--el-color-primary, #409eff);
  border-color: var(--el-color-primary, #409eff);
  color: white;
}

.tab-icon {
  font-size: 16px;
}

/* 公告列表 */
.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.announcement-card {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--color-border, #e4e7ed);
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.announcement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--el-color-primary, #409eff);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.type-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.type-system {
  background: #ecf5ff;
  color: #409eff;
}

.type-activity {
  background: #fdf6ec;
  color: #e6a23c;
}

.type-update {
  background: #f0f9eb;
  color: #67c23a;
}

.type-other {
  background: #f4f4f5;
  color: #909399;
}

.announcement-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary, #303133);
  margin: 0;
  line-height: 1.4;
}

.top-mark {
  padding: 2px 8px;
  background: #f56c6c;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.publish-time {
  font-size: 13px;
  color: var(--color-text-secondary, #909399);
  flex-shrink: 0;
}

.announcement-summary {
  font-size: 14px;
  color: var(--color-text-secondary, #909399);
  line-height: 1.6;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--color-border, #e4e7ed);
}

.view-count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-secondary, #909399);
}

.read-more {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--el-color-primary, #409eff);
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  padding: 80px 20px;
  text-align: center;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  font-size: 64px;
  color: var(--color-text-placeholder, #c0c4cc);
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-primary, #303133);
  margin: 0 0 8px 0;
}

.empty-desc {
  font-size: 14px;
  color: var(--color-text-secondary, #909399);
  margin: 0;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border, #e4e7ed);
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    padding: 32px 20px;
  }

  .page-title {
    font-size: 24px;
  }

  .header-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .container {
    padding: 16px;
  }

  .top-announcements {
    flex-direction: column;
  }

  .top-label {
    align-self: flex-start;
  }

  .card-header {
    flex-direction: column;
    gap: 8px;
  }

  .title-section {
    flex-wrap: wrap;
  }

  .publish-time {
    align-self: flex-start;
  }
}
</style>
