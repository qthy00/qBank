<script setup lang="ts">
import { AnnouncementApi } from '~/api/announcement'
import type { AnnouncementVO } from '~/types/announcement'
import { AnnouncementTypeEnum } from '~/types/announcement'

const route = useRoute()
const message = useMessage()

/* ==================== 状态管理 ==================== */
const announcement = ref<AnnouncementVO | null>(null)
const loading = ref(false)

/* ==================== 计算属性 ==================== */
const getTypeLabel = (type: number) => {
  switch (type) {
    case AnnouncementTypeEnum.SYSTEM:
      return '系统公告'
    case AnnouncementTypeEnum.ACTIVITY:
      return '活动通知'
    case AnnouncementTypeEnum.UPDATE:
      return '更新日志'
    default:
      return '其他'
  }
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
const loadAnnouncement = async () => {
  const id = Number(route.params.id)
  if (!id) {
    message.error('公告ID不存在')
    return
  }

  loading.value = true
  try {
    const data = await AnnouncementApi.getAnnouncementDetail(id)
    announcement.value = data
    /* 增加浏览量 */
    await AnnouncementApi.incrementViewCount(id)
    /* 更新页面标题 */
    useHead({
      title: `${data.title} - 公告详情`
    })
  } catch (e) {
    console.error(e)
    message.error('加载公告详情失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  navigateTo('/announcement')
}

const formatDate = (timestamp: number) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
  loadAnnouncement()
})
</script>

<template>
  <div class="announcement-detail-page">
    <div class="container">
      <!-- 返回按钮 -->
      <div class="back-section">
        <button class="back-btn" @click="goBack">
          <Icon name="ep:arrow-left" />
          <span>返回公告列表</span>
        </button>
      </div>

      <!-- 公告详情卡片 -->
      <div v-loading="loading" class="detail-card">
        <div v-if="announcement" class="detail-content">
          <!-- 头部信息 -->
          <div class="detail-header">
            <div class="header-top">
              <span
                class="type-tag"
                :class="getTypeTagClass(announcement.type)"
              >
                {{ getTypeLabel(announcement.type) }}
              </span>
              <span v-if="announcement.isTop" class="top-badge">置顶</span>
            </div>

            <h1 class="detail-title">{{ announcement.title }}</h1>

            <div class="detail-meta">
              <div class="meta-item">
                <Icon name="ep:clock" />
                <span>发布时间：{{ formatDate(announcement.publishTime) }}</span>
              </div>
              <div class="meta-item">
                <Icon name="ep:view" />
                <span>{{ announcement.viewCount }} 次浏览</span>
              </div>
            </div>
          </div>

          <!-- 内容区域 -->
          <div class="detail-body">
            <div class="content-text" v-html="announcement.content" />
          </div>

          <!-- 底部操作 -->
          <div class="detail-footer">
            <button class="action-btn share-btn" @click="message.info('分享功能开发中')">
              <Icon name="ep:share" />
              <span>分享</span>
            </button>
            <button class="action-btn back-btn-large" @click="goBack">
              <Icon name="ep:list" />
              <span>查看更多公告</span>
            </button>
          </div>
        </div>

        <!-- 空状态/错误状态 -->
        <div v-else-if="!loading" class="error-state">
          <div class="error-icon">
            <Icon name="ep:document-delete" />
          </div>
          <p class="error-title">公告不存在或已下线</p>
          <p class="error-desc">该公告可能已被删除或下架</p>
          <button class="error-action" @click="goBack">
            返回公告列表
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 页面基础 */
.announcement-detail-page {
  min-height: 100vh;
  background-color: var(--color-bg-container, #f5f7fa);
  padding: 24px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

/* 返回区域 */
.back-section {
  margin-bottom: 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid var(--color-border, #e4e7ed);
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: var(--color-text-primary, #303133);
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  border-color: var(--el-color-primary, #409eff);
  color: var(--el-color-primary, #409eff);
}

/* 详情卡片 */
.detail-card {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--color-border, #e4e7ed);
  min-height: 400px;
}

.detail-content {
  padding: 32px;
}

/* 头部信息 */
.detail-header {
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border, #e4e7ed);
  margin-bottom: 24px;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.type-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
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

.top-badge {
  padding: 2px 10px;
  background: #f56c6c;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.detail-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary, #303133);
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-secondary, #909399);
}

/* 内容区域 */
.detail-body {
  padding: 24px 0;
}

.content-text {
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-text-primary, #303133);
}

.content-text :deep(p) {
  margin-bottom: 16px;
}

.content-text :deep(ul),
.content-text :deep(ol) {
  margin-bottom: 16px;
  padding-left: 24px;
}

.content-text :deep(li) {
  margin-bottom: 8px;
}

.content-text :deep(h2),
.content-text :deep(h3) {
  margin: 24px 0 16px 0;
  font-weight: 600;
}

.content-text :deep(h2) {
  font-size: 18px;
}

.content-text :deep(h3) {
  font-size: 16px;
}

/* 底部操作 */
.detail-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border, #e4e7ed);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-btn {
  border: 1px solid var(--color-border, #e4e7ed);
  background: white;
  color: var(--color-text-primary, #303133);
}

.share-btn:hover {
  border-color: var(--el-color-primary, #409eff);
  color: var(--el-color-primary, #409eff);
}

.back-btn-large {
  border: none;
  background: var(--el-color-primary, #409eff);
  color: white;
}

.back-btn-large:hover {
  background: var(--el-color-primary-light-3, #66b1ff);
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.error-icon {
  font-size: 64px;
  color: var(--color-text-placeholder, #c0c4cc);
  margin-bottom: 16px;
}

.error-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-primary, #303133);
  margin: 0 0 8px 0;
}

.error-desc {
  font-size: 14px;
  color: var(--color-text-secondary, #909399);
  margin: 0 0 20px 0;
}

.error-action {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background: var(--el-color-primary, #409eff);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.error-action:hover {
  background: var(--el-color-primary-light-3, #66b1ff);
}

/* 响应式 */
@media (max-width: 768px) {
  .announcement-detail-page {
    padding: 16px;
  }

  .detail-content {
    padding: 20px;
  }

  .detail-title {
    font-size: 20px;
  }

  .detail-meta {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .detail-footer {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
