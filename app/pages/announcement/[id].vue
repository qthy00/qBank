<script setup lang="ts">
import { AnnouncementApi } from '~/api/announcement'
import type { AnnouncementVO } from '~/types/announcement'

const route = useRoute()
const message = useMessage()

/* ==================== 状态管理 ==================== */
const announcement = ref<AnnouncementVO | null>(null)
const loading = ref(false)

/* ==================== 计算属性 ==================== */
const getTypeLabel = (type: string) => {
  switch (type) {
    case 'SYSTEM':
      return '系统公告'
    case 'ACTIVITY':
      return '活动通知'
    case 'UPDATE':
      return '更新日志'
    default:
      return '其他'
  }
}

const getTypeIcon = (type: string ) => {
  switch (type) {
    case 'SYSTEM':
      return 'ep:monitor'
    case 'ACTIVITY':
      return 'ep:present'
    case 'UPDATE':
      return 'ep:refresh'
    default:
      return 'ep:notification'
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "SYSTEM":
      return '#409eff'
    case 'ACTIVITY':
      return '#e6a23c'
    case 'UPDATE':
      return '#67c23a'
    default:
      return '#909399'
  }
}

const getTypeGradient = (type: string) => {
  switch (type) {
    case 'SYSTEM':
      return 'linear-gradient(135deg, #409eff 0%, #66b1ff 100%)'
    case 'ACTIVITY':
      return 'linear-gradient(135deg, #e6a23c 0%, #f5c878 100%)'
    case 'UPDATE':
      return 'linear-gradient(135deg, #67c23a 0%, #95d475 100%)'
    default:
      return 'linear-gradient(135deg, #909399 0%, #c0c4cc 100%)'
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

const handleShare = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: announcement.value?.title || '公告详情',
        url: window.location.href
      })
    } else {
      /* 复制链接到剪贴板 */
      await navigator.clipboard.writeText(window.location.href)
      message.success('链接已复制到剪贴板')
    }
  } catch {
    message.info('分享功能暂不可用')
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  loadAnnouncement()
})
</script>

<template>
  <div class="announcement-detail-page">
    <!-- 头部横幅 -->
    <div
      class="page-header"
      :style="{ background: announcement ? getTypeGradient(announcement.noticeType) : 'linear-gradient(135deg, #409eff 0%, #66b1ff 100%)' }"
    >
      <div class="header-content">
        <div class="header-icon-wrapper">
          <div class="header-icon">
            <Icon :name="announcement ? getTypeIcon(announcement.noticeType) : 'ep:notification'" />
          </div>
          <div v-if="announcement?.isTop" class="top-indicator">
            <Icon name="ep:top" />
            <span>置顶</span>
          </div>
        </div>
        <div class="header-text">
          <div class="type-badge">
            <Icon :name="announcement ? getTypeIcon(announcement.noticeType) : 'ep:notification'" />
            <span>{{ announcement ? getTypeLabel(announcement.noticeType) : '公告详情' }}</span>
          </div>
          <h1 class="page-title">{{ announcement?.title || '公告详情' }}</h1>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- 返回按钮 -->
      <div class="back-section">
        <button class="back-btn" @click="goBack">
          <div class="back-icon">
            <Icon name="ep:arrow-left" />
          </div>
          <span>返回公告列表</span>
        </button>
      </div>

      <!-- 公告详情卡片 -->
      <div v-loading="loading" class="detail-card">
        <div v-if="announcement" class="detail-content">
          <!-- 元信息栏 -->
          <div class="meta-bar">
            <div class="meta-item">
              <div class="meta-icon">
                <Icon name="ep:calendar" />
              </div>
              <div class="meta-info">
                <span class="meta-label">发布时间</span>
                <span class="meta-value">{{ formatDate(announcement.updateTime) }}</span>
              </div>
            </div>
            <div class="meta-divider" />
            <div class="meta-item">
              <div class="meta-icon">
                <Icon name="ep:view" />
              </div>
              <div class="meta-info">
                <span class="meta-label">浏览次数</span>
                <span class="meta-value">{{ announcement.viewCount.toLocaleString() }} 次</span>
              </div>
            </div>
            <div class="meta-divider" />
            <div class="meta-item">
              <div class="meta-icon" :style="{ color: getTypeColor(announcement.noticeType) }">
                <Icon :name="getTypeIcon(announcement.noticeType)" />
              </div>
              <div class="meta-info">
                <span class="meta-label">公告类型</span>
                <span class="meta-value" :style="{ color: getTypeColor(announcement.noticeType) }">
                  {{ getTypeLabel(announcement.noticeType) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 内容区域 -->
          <div class="content-wrapper h-full" >
            <div class="content-text" v-html="announcement.content" />
          </div>

          <!-- 底部操作区 -->
          <div class="detail-footer">
            <div class="footer-left">
              <button class="action-btn secondary" @click="goBack">
                <Icon name="ep:list" />
                <span>查看更多公告</span>
              </button>
            </div>
            <div class="footer-right">
              <button class="action-btn primary" @click="handleShare">
                <Icon name="ep:share" />
                <span>分享公告</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态/错误状态 -->
        <div v-else-if="!loading" class="error-state">
          <div class="error-illustration">
            <div class="error-icon-bg">
              <Icon name="ep:document-delete" />
            </div>
          </div>
          <h2 class="error-title">公告不存在或已下线</h2>
          <p class="error-desc">该公告可能已被删除或下架，请查看其他公告</p>
          <button class="error-action" @click="goBack">
            <Icon name="ep:arrow-left" />
            <span>返回公告列表</span>
          </button>
        </div>
      </div>

      <!-- 快速返回顶部 -->
      <div v-if="announcement" class="floating-actions">
        <button class="float-btn" @click="scrollToTop" title="返回顶部">
          <Icon name="ep:top" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* ==================== 页面基础 ==================== */
.announcement-detail-page {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--color-bg-container, #f5f7fa) 0%, #ffffff 100%);
}

/* ==================== 头部横幅 ==================== */
.page-header {
  position: relative;
  padding: 60px 24px 80px;
  overflow: hidden;

  /* 装饰元素 */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    pointer-events: none;
  }
}

.header-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.header-icon-wrapper {
  position: relative;
  flex-shrink: 0;
}

.header-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.top-indicator {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: linear-gradient(135deg, #f56c6c, #ff8585);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
}

.header-text {
  flex: 1;
  padding-top: 8px;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: white;
  margin: 0;
  line-height: 1.4;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* ==================== 容器 ==================== */
.container {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px 60px;
}

/* ==================== 返回按钮区域 ==================== */
.back-section {
  margin: -40px 0 24px;
  position: relative;
  z-index: 10;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: white;
  border: 1px solid var(--color-border, #e4e7ed);
  border-radius: 12px;
  font-size: 14px;
  color: var(--color-text-primary, #303133);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: var(--el-color-primary, #409eff);
    color: var(--el-color-primary, #409eff);
  }
}

.back-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-container, #f5f7fa);
  border-radius: 8px;
  transition: all 0.3s ease;

  .back-btn:hover & {
    background: var(--el-color-primary-light-9, #ecf5ff);
  }
}

/* ==================== 详情卡片 ==================== */
.detail-card {
  background: white;
  border-radius: 16px;
  border: 1px solid var(--color-border, #e4e7ed);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  min-height: 550px;
  overflow: hidden;
}

.detail-content {
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==================== 元信息栏 ==================== */
.meta-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px 32px;
  background: linear-gradient(135deg, var(--color-bg-container, #f5f7fa) 0%, #ffffff 100%);
  border-bottom: 1px solid var(--color-border, #e4e7ed);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  font-size: 18px;
  color: var(--color-text-secondary, #909399);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 12px;
  color: var(--color-text-secondary, #909399);
}

.meta-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary, #303133);
}

.meta-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border, #e4e7ed);
}

/* ==================== 内容区域 ==================== */
.content-wrapper {
  padding: 40px 48px;
  min-height: 500px;
}

.content-text {
  font-size: 16px;
  line-height: 1.8;
  color: var(--color-text-primary, #303133);

  /* 富文本样式优化 */
  :deep(p) {
    margin-bottom: 20px;
    line-height: 1.8;
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }

  :deep(ul),
  :deep(ol) {
    margin-bottom: 20px;
    padding-left: 28px;
  }

  :deep(li) {
    margin-bottom: 10px;
    line-height: 1.7;
  }

  :deep(h1),
  :deep(h2) {
    margin: 32px 0 20px 0;
    font-weight: 600;
    color: var(--color-text-primary, #303133);
    padding-bottom: 12px;
    border-bottom: 2px solid var(--color-border, #e4e7ed);
  }

  :deep(h1) {
    font-size: 24px;
  }

  :deep(h2) {
    font-size: 20px;
  }

  :deep(h3) {
    margin: 24px 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text-primary, #303133);
  }

  :deep(h4) {
    margin: 20px 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-primary, #303133);
  }

  :deep(a) {
    color: var(--el-color-primary, #409eff);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all 0.2s ease;

    &:hover {
      border-bottom-color: var(--el-color-primary, #409eff);
    }
  }

  :deep(img) {
    max-width: 100%;
    border-radius: 8px;
    margin: 20px 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  :deep(blockquote) {
    margin: 20px 0;
    padding: 16px 20px;
    background: var(--color-bg-container, #f5f7fa);
    border-left: 4px solid var(--el-color-primary, #409eff);
    border-radius: 0 8px 8px 0;
    color: var(--color-text-secondary, #606266);
    font-style: italic;
  }

  :deep(code) {
    padding: 2px 8px;
    background: var(--color-bg-container, #f5f7fa);
    border-radius: 4px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 14px;
    color: var(--color-danger, #f56c6c);
  }

  :deep(pre) {
    margin: 20px 0;
    padding: 20px;
    background: #2d3748;
    border-radius: 12px;
    overflow-x: auto;

    code {
      background: transparent;
      color: #e2e8f0;
      padding: 0;
    }
  }

  :deep(table) {
    width: 100%;
    margin: 20px 0;
    border-collapse: collapse;
    border-radius: 8px;
    overflow: hidden;
  }

  :deep(th),
  :deep(td) {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid var(--color-border, #e4e7ed);
  }

  :deep(th) {
    background: var(--color-bg-container, #f5f7fa);
    font-weight: 600;
    color: var(--color-text-primary, #303133);
  }

  :deep(tr:hover) {
    background: var(--color-bg-container-hover, #f5f7fa);
  }
}

/* ==================== 底部操作区 ==================== */
.detail-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 32px;
  background: linear-gradient(180deg, #ffffff 0%, var(--color-bg-container, #f5f7fa) 100%);
  border-top: 1px solid var(--color-border, #e4e7ed);
}

.footer-left,
.footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &.secondary {
    background: white;
    border: 1px solid var(--color-border, #e4e7ed);
    color: var(--color-text-primary, #303133);

    &:hover {
      border-color: var(--el-color-primary, #409eff);
      color: var(--el-color-primary, #409eff);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
    }
  }

  &.primary {
    background: linear-gradient(135deg, var(--el-color-primary, #409eff) 0%, var(--el-color-primary-light-3, #66b1ff) 100%);
    border: none;
    color: white;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(64, 158, 255, 0.4);
    }
  }
}

/* ==================== 错误状态 ==================== */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 40px;
  text-align: center;
  animation: fadeInUp 0.5s ease;
}

.error-illustration {
  margin-bottom: 32px;
}

.error-icon-bg {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-bg-container, #f5f7fa) 0%, #ffffff 100%);
  border-radius: 50%;
  font-size: 56px;
  color: var(--color-text-placeholder, #c0c4cc);
  border: 2px solid var(--color-border, #e4e7ed);
}

.error-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-primary, #303133);
  margin: 0 0 12px 0;
}

.error-desc {
  font-size: 15px;
  color: var(--color-text-secondary, #909399);
  margin: 0 0 28px 0;
  max-width: 400px;
}

.error-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, var(--el-color-primary, #409eff) 0%, var(--el-color-primary-light-3, #66b1ff) 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(64, 158, 255, 0.4);
  }
}

/* ==================== 浮动操作按钮 ==================== */
.floating-actions {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 100;
}

.float-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid var(--color-border, #e4e7ed);
  border-radius: 50%;
  font-size: 20px;
  color: var(--color-text-secondary, #909399);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    color: var(--el-color-primary, #409eff);
    border-color: var(--el-color-primary, #409eff);
  }
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .page-header {
    padding: 40px 20px 60px;
  }

  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }

  .header-icon {
    width: 64px;
    height: 64px;
    font-size: 32px;
    border-radius: 16px;
  }

  .header-text {
    padding-top: 0;
  }

  .page-title {
    font-size: 22px;
  }

  .container {
    padding: 0 16px 40px;
  }

  .back-section {
    margin: -30px 0 16px;
  }

  .back-btn {
    padding: 10px 16px;
    font-size: 13px;
  }

  .detail-card {
    border-radius: 12px;
  }

  .meta-bar {
    flex-direction: column;
    gap: 16px;
    padding: 20px 24px;
  }

  .meta-divider {
    width: 100%;
    height: 1px;
  }

  .content-wrapper {
    padding: 24px;
  }

  .content-text {
    font-size: 15px;

    :deep(h1) {
      font-size: 20px;
    }

    :deep(h2) {
      font-size: 18px;
    }

    :deep(h3) {
      font-size: 16px;
    }

    :deep(pre) {
      padding: 16px;
    }
  }

  .detail-footer {
    flex-direction: column;
    padding: 20px 24px;
  }

  .footer-left,
  .footer-right {
    width: 100%;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .floating-actions {
    bottom: 20px;
    right: 20px;
  }

  .float-btn {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
}

/* ==================== 小屏幕优化 ==================== */
@media (max-width: 480px) {
  .page-header {
    padding: 32px 16px 48px;
  }

  .page-title {
    font-size: 20px;
  }

  .container {
    padding: 0 12px 32px;
  }

  .content-wrapper {
    padding: 20px;
  }
}
</style>
