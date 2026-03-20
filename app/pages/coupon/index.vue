<script setup lang="ts">
import {
  getAvailableCouponList,
  receiveCoupon,
} from '@/api/coupon'
import { CouponTypeEnum, CouponStatusEnum, type CouponVO } from '~/types/coupon/index'
import { fen2yuan } from '~/utils/money'

useHead({
  title: '领券中心'
})

const message = useMessage()

/* ==================== 状态管理 ==================== */
const loading = ref(false)
const receiveLoading = ref<number | null>(null)
const couponList = ref<CouponVO[]>([])
const activeTab = ref('all')

/* ==================== 计算属性 ==================== */
const filteredCoupons = computed(() => {
  if (activeTab.value === 'all') return couponList.value
  if (activeTab.value === 'full_reduction') {
    return couponList.value.filter(c => c.type === CouponTypeEnum.FULL_REDUCTION)
  }
  if (activeTab.value === 'discount') {
    return couponList.value.filter(c => c.type === CouponTypeEnum.DISCOUNT)
  }
  if (activeTab.value === 'no_threshold') {
    return couponList.value.filter(c => c.type === CouponTypeEnum.NO_THRESHOLD)
  }
  return couponList.value
})

/* ==================== 方法 ==================== */
const loadCoupons = async () => {
  loading.value = true
  try {
    const data = await getAvailableCouponList({
      status: CouponStatusEnum.IN_PROGRESS
    })
    couponList.value = data || []
  } catch (e) {
    console.error(e)
    message.error('加载优惠券失败')
  } finally {
    loading.value = false
  }
}

const handleReceive = async (coupon: CouponVO) => {
  if (!coupon.canReceive) {
    message.warning('该优惠券暂不可领取')
    return
  }
  if (receiveLoading.value) return

  receiveLoading.value = coupon.id
  try {
    await receiveCoupon({ couponId: coupon.id })
    message.success(`成功领取「${coupon.name}」`)
    /* 更新优惠券状态 */
    const index = couponList.value.findIndex(c => c.id === coupon.id)
    if (index && index !== -1 && couponList.value) {
      couponList.value[index].usedCount++
      couponList.value[index].remainCount--
    }
  } catch (e) {
    console.error(e)
    message.error('领取失败，请稍后重试')
  } finally {
    receiveLoading.value = null
  }
}

const getCouponTypeName = (type: number) => {
  switch (type) {
    case CouponTypeEnum.FULL_REDUCTION:
      return '满减券'
    case CouponTypeEnum.DISCOUNT:
      return '折扣券'
    case CouponTypeEnum.NO_THRESHOLD:
      return '无门槛'
    default:
      return '优惠券'
  }
}

const getCouponTypeTheme = (type: number) => {
  switch (type) {
    case CouponTypeEnum.FULL_REDUCTION:
      return { color: '#f56c6c', bg: '#fef0f0', border: '#fde2e2' }
    case CouponTypeEnum.DISCOUNT:
      return { color: '#409eff', bg: '#ecf5ff', border: '#d9ecff' }
    case CouponTypeEnum.NO_THRESHOLD:
      return { color: '#67c23a', bg: '#f0f9eb', border: '#e1f3d8' }
    default:
      return { color: '#909399', bg: '#f4f4f5', border: '#e9e9eb' }
  }
}

const formatTime = (timestamp: number) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const getProgressPercentage = (coupon: CouponVO) => {
  if (coupon.totalCount === -1) {
    /* 无限数量，根据领取数量估算 */
    const estimated = Math.min(coupon.usedCount, 100)
    return Math.round((estimated / (estimated + 50)) * 100)
  }
  return Math.round((coupon.usedCount / coupon.totalCount) * 100)
}

onMounted(() => {
  loadCoupons()
})
</script>

<template>
  <div class="coupon-page">
    <!-- 头部区域 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <Icon name="ep:ticket" />
        </div>
        <div class="header-text">
          <h1 class="page-title">领券中心</h1>
          <p class="page-subtitle">每日精选优惠券，下单更省钱</p>
        </div>
      </div>
      <div class="header-pattern" />
    </div>

    <div class="container">
      <!-- 统计信息 -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-value">{{ couponList.length }}</span>
          <span class="stat-label">可领取优惠券</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-value">{{ couponList.filter(c => c.type === CouponTypeEnum.FULL_REDUCTION).length }}</span>
          <span class="stat-label">满减券</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-value">{{ couponList.filter(c => c.type === CouponTypeEnum.DISCOUNT).length }}</span>
          <span class="stat-label">折扣券</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-value">{{ couponList.filter(c => c.type === CouponTypeEnum.NO_THRESHOLD).length }}</span>
          <span class="stat-label">无门槛券</span>
        </div>
      </div>

      <!-- 标签筛选 -->
      <div class="filter-section">
        <div class="filter-tabs">
          <button
            v-for="tab in [
              { key: 'all', label: '全部' },
              { key: 'full_reduction', label: '满减券' },
              { key: 'discount', label: '折扣券' },
              { key: 'no_threshold', label: '无门槛' }
            ]"
            :key="tab.key"
            class="tab-btn"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- 优惠券列表 -->
      <div v-loading="loading" class="coupon-grid">
        <div
          v-for="coupon in filteredCoupons"
          :key="coupon.id"
          class="coupon-card"
          :class="{ disabled: !coupon.canReceive }"
        >
          <!-- 优惠券类型标签 -->
          <div
            class="type-tag"
            :style="{
              color: getCouponTypeTheme(coupon.type).color,
              backgroundColor: getCouponTypeTheme(coupon.type).bg
            }"
          >
            {{ getCouponTypeName(coupon.type) }}
          </div>

          <!-- 主要内容 -->
          <div class="card-content">
            <div class="amount-section">
              <div class="amount-wrapper">
                <span class="currency">¥</span>
                <span class="amount">{{ fen2yuan(coupon.discountAmount) }}</span>
              </div>
              <div v-if="coupon.type === CouponTypeEnum.FULL_REDUCTION && coupon.minAmount > 0" class="condition">
                满{{ fen2yuan(coupon.minAmount) }}元可用
              </div>
              <div v-else-if="coupon.type === CouponTypeEnum.DISCOUNT" class="condition">
                {{ coupon.discountPercent }}折
              </div>
              <div v-else class="condition">
                无使用门槛
              </div>
            </div>

            <div class="info-section">
              <h3 class="coupon-name">{{ coupon.name }}</h3>
              <p class="coupon-desc">{{ coupon.description }}</p>

              <div class="time-info">
                <Icon name="ep:clock" class="time-icon" />
                <span>{{ formatTime(coupon.startTime) }} - {{ formatTime(coupon.endTime) }}</span>
              </div>
            </div>
          </div>

          <!-- 底部操作区 -->
          <div class="card-footer">
            <div class="progress-section">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{
                    width: `${getProgressPercentage(coupon)}%`,
                    backgroundColor: getCouponTypeTheme(coupon.type).color
                  }"
                />
              </div>
              <span class="remain-text">
                {{ coupon.remainCount > 0 ? `剩余 ${coupon.remainCount} 张` : '已领完' }}
              </span>
            </div>

            <button
              class="receive-btn"
              :class="{ disabled: !coupon.canReceive, loading: receiveLoading === coupon.id }"
              :disabled="!coupon.canReceive || receiveLoading !== null"
              @click="handleReceive(coupon)"
            >
              <Icon v-if="receiveLoading === coupon.id" name="ep:loading" class="btn-icon spinning" />
              <span v-else-if="coupon.canReceive">立即领取</span>
              <span v-else>已领完</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && filteredCoupons.length === 0" class="empty-state">
        <div class="empty-icon">
          <Icon name="ep:ticket" />
        </div>
        <p class="empty-title">暂无可用优惠券</p>
        <p class="empty-desc">敬请期待更多优惠活动</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 页面基础 */
.coupon-page {
  min-height: 100vh;
  background-color: var(--color-bg-container, #f5f7fa);
}

/* 头部区域 */
.page-header {
  background: var(--el-color-primary, #409eff);
  padding: 48px 24px;
  position: relative;
  overflow: hidden;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1;
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

.header-pattern {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%);
  transform: skewX(-15deg);
}

/* 容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 48px;
}

/* 统计栏 */
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  margin-top: -24px;
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-color-primary, #409eff);
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--color-text-secondary, #909399);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border, #e4e7ed);
}

/* 筛选区 */
.filter-section {
  margin: 24px 0;
}

.filter-tabs {
  display: flex;
  gap: 12px;
}

.tab-btn {
  padding: 10px 24px;
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

/* 优惠券网格 */
.coupon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

/* 优惠券卡片 */
.coupon-card {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--color-border, #e4e7ed);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.coupon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.coupon-card.disabled {
  opacity: 0.7;
}

.coupon-card.disabled .receive-btn {
  background: #c0c4cc;
  cursor: not-allowed;
}

/* 类型标签 */
.type-tag {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* 卡片内容 */
.card-content {
  padding: 24px;
  display: flex;
  gap: 20px;
}

.amount-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 100px;
}

.amount-wrapper {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.currency {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-color-danger, #f56c6c);
}

.amount {
  font-size: 48px;
  font-weight: 700;
  color: var(--el-color-danger, #f56c6c);
  line-height: 1;
}

.condition {
  font-size: 13px;
  color: var(--color-text-secondary, #909399);
  margin-top: 8px;
}

.info-section {
  flex: 1;
  min-width: 0;
}

.coupon-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary, #303133);
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.coupon-desc {
  font-size: 13px;
  color: var(--color-text-secondary, #909399);
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.time-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-secondary, #909399);
}

.time-icon {
  font-size: 14px;
}

/* 卡片底部 */
.card-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--color-border, #e4e7ed);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.progress-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-bar {
  height: 4px;
  background: var(--color-border, #e4e7ed);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.remain-text {
  font-size: 12px;
  color: var(--color-text-secondary, #909399);
}

/* 领取按钮 */
.receive-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background: var(--el-color-primary, #409eff);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.receive-btn:hover:not(:disabled) {
  background: var(--el-color-primary-light-3, #66b1ff);
  transform: scale(1.02);
}

.receive-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.receive-btn.disabled {
  background: #c0c4cc;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 16px;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 80px;
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

  .stats-bar {
    flex-wrap: wrap;
    gap: 16px;
    padding: 16px;
  }

  .stat-divider {
    display: none;
  }

  .stat-item {
    flex: 1;
    min-width: 80px;
  }

  .filter-tabs {
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 8px 16px;
    font-size: 13px;
  }

  .coupon-grid {
    grid-template-columns: 1fr;
  }

  .card-content {
    flex-direction: column;
    gap: 16px;
  }

  .amount-section {
    align-items: flex-start;
  }

  .amount {
    font-size: 36px;
  }
}
</style>
