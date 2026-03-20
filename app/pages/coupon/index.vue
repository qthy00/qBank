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

const getCouponTypeClass = (type: number) => {
  switch (type) {
    case CouponTypeEnum.FULL_REDUCTION:
      return 'type-reduction'
    case CouponTypeEnum.DISCOUNT:
      return 'type-discount'
    case CouponTypeEnum.NO_THRESHOLD:
      return 'type-no-threshold'
    default:
      return ''
  }
}

const formatTime = (timestamp: number) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const getCountdownText = (coupon: CouponVO) => {
  if (coupon.countdown <= 0) return '已结束'
  const days = Math.floor(coupon.countdown / 86400)
  if (days > 0) return `剩${days}天`
  const hours = Math.floor(coupon.countdown / 3600)
  if (hours > 0) return `剩${hours}小时`
  return '即将结束'
}

onMounted(() => {
  loadCoupons()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部横幅 -->
    <div class="coupon-banner">
      <div class="banner-content">
        <h1 class="banner-title">领券中心</h1>
        <p class="banner-subtitle">海量优惠券等你来领，下单立省</p>
      </div>
    </div>

    <div class="max-w-1200px mx-auto px-4 py-8">
      <!-- 标签筛选 -->
      <div class="filter-tabs mb-6">
        <el-radio-group v-model="activeTab" size="large">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="full_reduction">满减券</el-radio-button>
          <el-radio-button label="discount">折扣券</el-radio-button>
          <el-radio-button label="no_threshold">无门槛</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 优惠券列表 -->
      <div v-loading="loading" class="coupon-grid">
        <div
          v-for="coupon in filteredCoupons"
          :key="coupon.id"
          class="coupon-card"
          :class="{ 'disabled': !coupon.canReceive }"
        >
          <!-- 左侧金额区 -->
          <div class="coupon-left" :class="getCouponTypeClass(coupon.type)">
            <div class="coupon-amount">
              <span class="currency">¥</span>
              <span class="amount">{{ fen2yuan(coupon.discountAmount) }}</span>
            </div>
            <div class="coupon-type">{{ getCouponTypeName(coupon.type) }}</div>
          </div>

          <!-- 右侧信息区 -->
          <div class="coupon-right">
            <div class="coupon-header">
              <h3 class="coupon-name">{{ coupon.name }}</h3>
              <el-tag
                v-if="coupon.type === CouponTypeEnum.FULL_REDUCTION && coupon.minAmount > 0"
                size="small"
                type="warning"
                class="condition-tag"
              >
                满{{ fen2yuan(coupon.minAmount) }}可用
              </el-tag>
              <el-tag
                v-else-if="coupon.type === CouponTypeEnum.NO_THRESHOLD"
                size="small"
                type="success"
                class="condition-tag"
              >
                无门槛
              </el-tag>
              <el-tag
                v-else-if="coupon.type === CouponTypeEnum.DISCOUNT"
                size="small"
                type="primary"
                class="condition-tag"
              >
                {{ coupon.discountPercent }}折
              </el-tag>
            </div>

            <p class="coupon-desc">{{ coupon.description }}</p>

            <div class="coupon-footer">
              <div class="coupon-time">
                <Icon name="ep:clock" class="time-icon" />
                <span>{{ formatTime(coupon.startTime) }} - {{ formatTime(coupon.endTime) }}</span>
              </div>
              <div class="coupon-remain">
                <el-progress
                  :percentage="Math.round((coupon.usedCount / (coupon.totalCount === -1 ? coupon.usedCount + 100 : coupon.totalCount)) * 100)"
                  :show-text="false"
                  :stroke-width="6"
                  class="remain-progress"
                />
                <span class="remain-text">{{ coupon.remainCount > 0 ? `剩${coupon.remainCount}张` : '已领完' }}</span>
              </div>
            </div>

            <el-button
              type="primary"
              size="default"
              class="receive-btn"
              :loading="receiveLoading === coupon.id"
              :disabled="!coupon.canReceive || receiveLoading !== null"
              @click="handleReceive(coupon)"
            >
              {{ coupon.canReceive ? '立即领取' : '已领完' }}
            </el-button>
          </div>

          <!-- 装饰圆点 -->
          <div class="decoration-dot top"></div>
          <div class="decoration-dot bottom"></div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && filteredCoupons.length === 0" class="empty-state">
        <el-empty description="暂无可用优惠券">
          <template #image>
            <Icon name="ep:ticket" class="empty-icon" />
          </template>
          <p class="empty-text">敬请期待更多优惠活动</p>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 头部横幅 */
.coupon-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px;
  text-align: center;
  color: white;
}

.banner-content {
  max-width: 800px;
  margin: 0 auto;
}

.banner-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.banner-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

/* 筛选标签 */
.filter-tabs {
  display: flex;
  justify-content: center;
}

:deep(.el-radio-button__inner) {
  padding: 12px 24px;
  font-size: 14px;
}

/* 优惠券网格 */
.coupon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
}

/* 优惠券卡片 */
.coupon-card {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
}

.coupon-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.coupon-card.disabled {
  opacity: 0.7;
}

.coupon-card.disabled .coupon-left {
  background: #cbd5e1 !important;
}

/* 装饰圆点 */
.decoration-dot {
  position: absolute;
  left: 110px;
  width: 16px;
  height: 16px;
  background: #f9fafb;
  border-radius: 50%;
  z-index: 1;
}

.decoration-dot.top {
  top: -8px;
}

.decoration-dot.bottom {
  bottom: -8px;
}

/* 左侧金额区 */
.coupon-left {
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
}

.type-reduction {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.type-discount {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.type-no-threshold {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.coupon-amount {
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: 20px;
  font-weight: 600;
}

.amount {
  font-size: 42px;
  font-weight: 700;
  line-height: 1;
}

.coupon-type {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 4px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

/* 右侧信息区 */
.coupon-right {
  flex: 1;
  padding: 16px 20px;
  position: relative;
}

.coupon-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.coupon-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.condition-tag {
  flex-shrink: 0;
}

.coupon-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px 0;
  line-height: 1.5;
  min-height: 20px;
}

.coupon-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.coupon-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.time-icon {
  font-size: 12px;
}

.coupon-remain {
  display: flex;
  align-items: center;
  gap: 8px;
}

.remain-progress {
  width: 80px;
}

.remain-text {
  font-size: 11px;
  color: #9ca3af;
}

/* 领取按钮 */
.receive-btn {
  position: absolute;
  right: 16px;
  bottom: 16px;
  min-width: 90px;
}

/* 空状态 */
.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 80px;
  color: #d1d5db;
}

.empty-text {
  color: #9ca3af;
  font-size: 14px;
  margin-top: 16px;
}

/* 响应式 */
@media (max-width: 768px) {
  .coupon-grid {
    grid-template-columns: 1fr;
  }

  .coupon-banner {
    padding: 40px 20px;
  }

  .banner-title {
    font-size: 28px;
  }
}
</style>
