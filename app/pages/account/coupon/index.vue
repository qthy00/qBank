<script setup lang="ts">
import {
  getMyCouponList,
  getCouponUsageRecords,
} from '~/api/coupon'
import {type CouponUsageRecord, UserCouponStatusEnum, type UserCouponVO} from '@/types/coupon'
import { fen2yuan } from '~/utils/money'

definePageMeta({
  layout: 'member'
})

useHead({
  title: '我的优惠券'
})

const message = useMessage()

/* ==================== 状态管理 ==================== */
const activeTab = ref(UserCouponStatusEnum.UNUSED)
const loading = ref(false)
const couponList = ref<UserCouponVO[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

/* 使用记录 */
const showRecords = ref(false)
const recordLoading = ref(false)
const usageRecords = ref<CouponUsageRecord[]>([])
const recordPage = ref(1)
const recordTotal = ref(0)

/* ==================== 计算属性 ==================== */
const filteredCoupons = computed(() => {
  return couponList.value.filter(c => c.status === activeTab.value)
})

const getTabCount = (status: number) => {
  return couponList.value.filter(c => c.status === status).length
}

/* ==================== 方法 ==================== */
const loadCoupons = async () => {
  loading.value = true
  try {
    const data = await getMyCouponList({
      status: activeTab.value,
      pageNo: currentPage.value,
      pageSize: pageSize.value
    })
    if (data && Array.isArray(data)) {
      couponList.value = data
    }
  } catch (e) {
    console.error(e)
    message.error('加载优惠券失败')
  } finally {
    loading.value = false
  }
}

const handleTabChange = () => {
  currentPage.value = 1
  loadCoupons()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadCoupons()
}

const handleUse = (coupon: UserCouponVO) => {
  /* 跳转到题库列表页面 */
  navigateTo('/qbank')
}

const showUsageHistory = async () => {
  showRecords.value = true
  recordLoading.value = true
  try {
    const data = await getCouponUsageRecords({
      pageNo: recordPage.value,
      pageSize: 10
    })
    if (data) {
      usageRecords.value = data.list || []
      recordTotal.value = data.total || 0
    }
  } catch (e) {
    console.error(e)
    message.error('加载使用记录失败')
  } finally {
    recordLoading.value = false
  }
}

const getStatusText = (status: number) => {
  switch (status) {
    case UserCouponStatusEnum.UNUSED:
      return '未使用'
    case UserCouponStatusEnum.USED:
      return '已使用'
    case UserCouponStatusEnum.EXPIRED:
      return '已过期'
    default:
      return '未知'
  }
}

const getStatusTheme = (status: number) => {
  switch (status) {
    case UserCouponStatusEnum.UNUSED:
      return { color: '#67c23a', bg: '#f0f9eb', border: '#e1f3d8' }
    case UserCouponStatusEnum.USED:
      return { color: '#909399', bg: '#f4f4f5', border: '#e9e9eb' }
    case UserCouponStatusEnum.EXPIRED:
      return { color: '#f56c6c', bg: '#fef0f0', border: '#fde2e2' }
    default:
      return { color: '#909399', bg: '#f4f4f5', border: '#e9e9eb' }
  }
}

const getTypeText = (type: number) => {
  switch (type) {
    case 1:
      return '满减券'
    case 2:
      return '折扣券'
    case 3:
      return '无门槛'
    default:
      return '优惠券'
  }
}

const formatDate = (timestamp: number) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const formatDateTime = (timestamp: number) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  return `${formatDate(timestamp)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
  loadCoupons()
})
</script>

<template>
  <div class="coupon-page">
    <el-card shadow="never" class="page-card">
      <template #header>
        <div class="page-header">
          <div class="header-left">
            <div class="header-icon">
              <Icon name="ep:ticket" />
            </div>
            <div class="header-info">
              <h2 class="header-title">我的优惠券</h2>
              <p class="header-desc">管理您的优惠券，下单时自动抵扣</p>
            </div>
          </div>
          <div class="header-actions">
            <button class="action-btn primary" @click="navigateTo('/coupon')">
              <Icon name="ep:plus" />
              <span>去领券</span>
            </button>
            <button class="action-btn secondary" @click="showUsageHistory">
              <Icon name="ep:clock" />
              <span>使用记录</span>
            </button>
          </div>
        </div>
      </template>

      <!-- 标签页 -->
      <div class="tabs-section">
        <div class="custom-tabs">
          <button
            v-for="tab in [
              { status: UserCouponStatusEnum.UNUSED, label: '未使用', icon: 'ep:check' },
              { status: UserCouponStatusEnum.USED, label: '已使用', icon: 'ep:circle-check' },
              { status: UserCouponStatusEnum.EXPIRED, label: '已过期', icon: 'ep:delete' }
            ]"
            :key="tab.status"
            class="tab-item"
            :class="{ active: activeTab === tab.status }"
            @click="activeTab = tab.status; handleTabChange()"
          >
            <Icon :name="tab.icon" class="tab-icon" />
            <span class="tab-label">{{ tab.label }}</span>
            <span
              class="tab-badge"
              :style="activeTab === tab.status ? {
                background: getStatusTheme(tab.status).color,
                color: 'white'
              } : {}"
            >
              {{ getTabCount(tab.status) }}
            </span>
          </button>
        </div>
      </div>

      <!-- 优惠券列表 -->
      <div v-loading="loading" class="coupon-list">
        <div
          v-for="coupon in filteredCoupons"
          :key="coupon.id"
          class="coupon-item"
          :class="[
            `status-${coupon.status}`,
            { 'expiring': coupon.isExpiringSoon && coupon.status === UserCouponStatusEnum.UNUSED }
          ]"
        >
          <!-- 左侧金额区 -->
          <div class="item-left">
            <div class="amount-block">
              <span class="currency">¥</span>
              <span class="amount">{{ fen2yuan(coupon.discountAmount) }}</span>
            </div>
            <div v-if="coupon.minAmount > 0" class="condition">
              满{{ fen2yuan(coupon.minAmount) }}元可用
            </div>
            <div v-else class="condition">
              无门槛
            </div>
          </div>

          <!-- 分隔线 -->
          <div class="divider" />

          <!-- 中间信息区 -->
          <div class="item-center">
            <div class="coupon-header">
              <h3 class="coupon-name">{{ coupon.couponName }}</h3>
              <span
                class="status-badge"
                :style="{
                  color: getStatusTheme(coupon.status).color,
                  backgroundColor: getStatusTheme(coupon.status).bg
                }"
              >
                {{ getStatusText(coupon.status) }}
              </span>
            </div>

            <div class="coupon-tags">
              <span class="tag type-tag">{{ getTypeText(coupon.type) }}</span>
              <span v-if="coupon.isExpiringSoon && coupon.status === UserCouponStatusEnum.UNUSED" class="tag warning-tag">
                <Icon name="ep:warning" />
                即将过期
              </span>
            </div>

            <div class="coupon-time">
              <Icon name="ep:calendar" class="time-icon" />
              <span v-if="coupon.status === UserCouponStatusEnum.USED">
                使用时间：{{ formatDateTime(coupon.useTime) }}
              </span>
              <span v-else-if="coupon.status === UserCouponStatusEnum.EXPIRED">
                过期时间：{{ formatDate(coupon.validEndTime) }}
              </span>
              <span v-else>
                有效期：{{ formatDate(coupon.validStartTime) }} 至 {{ formatDate(coupon.validEndTime) }}
              </span>
            </div>
          </div>

          <!-- 右侧操作区 -->
          <div class="item-right">
            <button
              v-if="coupon.status === UserCouponStatusEnum.UNUSED"
              class="use-btn"
              @click="handleUse(coupon)"
            >
              立即使用
            </button>
            <button
              v-else
              class="use-btn disabled"
              disabled
            >
              {{ coupon.status === UserCouponStatusEnum.USED ? '已使用' : '已过期' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && filteredCoupons.length === 0" class="empty-state">
        <div class="empty-icon">
          <Icon name="ep:ticket" />
        </div>
        <p class="empty-title">
          {{ activeTab === UserCouponStatusEnum.UNUSED ? '暂无未使用优惠券' :
             activeTab === UserCouponStatusEnum.USED ? '暂无已使用优惠券' : '暂无已过期优惠券' }}
        </p>
        <p class="empty-desc">
          {{ activeTab === UserCouponStatusEnum.UNUSED ? '快去领券中心领取吧' : '' }}
        </p>
        <button
          v-if="activeTab === UserCouponStatusEnum.UNUSED"
          class="empty-action"
          @click="navigateTo('/coupon')"
        >
          去领券中心
        </button>
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
    </el-card>

    <!-- 使用记录弹窗 -->
    <el-dialog
      v-model="showRecords"
      title="优惠券使用记录"
      width="720px"
      destroy-on-close
      class="record-dialog"
    >
      <div v-loading="recordLoading" class="record-content">
        <div v-if="usageRecords.length > 0" class="record-list">
          <div
            v-for="record in usageRecords"
            :key="record.id"
            class="record-item"
          >
            <div class="record-info">
              <div class="record-header">
                <span class="record-coupon">{{ record.couponName }}</span>
                <span class="record-amount">-¥{{ fen2yuan(record.discountAmount) }}</span>
              </div>
              <div class="record-meta">
                <span class="record-order">
                  <Icon name="ep:document" />
                  {{ record.orderNo }}
                </span>
                <span class="record-time">
                  <Icon name="ep:clock" />
                  {{ formatDateTime(record.useTime) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!recordLoading" class="record-empty">
          <Icon name="ep:document-delete" class="empty-icon" />
          <p>暂无使用记录</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
/* 页面容器 */
.coupon-page {
  padding: 0 12px;
}

.page-card {
  border-radius: 12px;
  border: none;
}

.page-card :deep(.el-card__header) {
  padding: 0;
  border-bottom: 1px solid var(--color-border, #e4e7ed);
}

.page-card :deep(.el-card__body) {
  padding: 0;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--el-color-primary, #409eff), var(--el-color-primary-light-3, #66b1ff));
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary, #303133);
  margin: 0;
}

.header-desc {
  font-size: 13px;
  color: var(--color-text-secondary, #909399);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.action-btn.primary {
  background: var(--el-color-primary, #409eff);
  color: white;
}

.action-btn.primary:hover {
  background: var(--el-color-primary-light-3, #66b1ff);
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: var(--color-bg-container, #f5f7fa);
  color: var(--color-text-primary, #303133);
  border: 1px solid var(--color-border, #e4e7ed);
}

.action-btn.secondary:hover {
  background: var(--color-border, #e4e7ed);
}

/* 标签页 */
.tabs-section {
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border, #e4e7ed);
}

.custom-tabs {
  display: flex;
  gap: 8px;
}

.tab-item {
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

.tab-item:hover {
  border-color: var(--el-color-primary, #409eff);
  color: var(--el-color-primary, #409eff);
}

.tab-item.active {
  background: var(--el-color-primary, #409eff);
  border-color: var(--el-color-primary, #409eff);
  color: white;
}

.tab-icon {
  font-size: 16px;
}

.tab-badge {
  padding: 2px 10px;
  background: var(--color-bg-container, #f5f7fa);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary, #909399);
  transition: all 0.2s ease;
}

/* 优惠券列表 */
.coupon-list {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.coupon-item {
  display: flex;
  align-items: stretch;
  background: white;
  border: 1px solid var(--color-border, #e4e7ed);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.coupon-item:hover {
  border-color: var(--el-color-primary, #409eff);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.1);
}

.coupon-item.status-2,
.coupon-item.status-3 {
  opacity: 0.7;
  background: var(--color-bg-container, #f5f7fa);
}

.coupon-item.expiring {
  border-color: #e6a23c;
  background: linear-gradient(135deg, #fdf6ec 0%, #ffffff 100%);
}

/* 左侧金额区 */
.item-left {
  width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #fef0f0 0%, #ffffff 100%);
  border-right: 1px dashed var(--color-border, #e4e7ed);
}

.coupon-item.status-2 .item-left,
.coupon-item.status-3 .item-left {
  background: linear-gradient(135deg, #f4f4f5 0%, #ffffff 100%);
}

.coupon-item.expiring .item-left {
  background: linear-gradient(135deg, #fdf6ec 0%, #ffffff 100%);
}

.amount-block {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.currency {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-color-danger, #f56c6c);
}

.amount {
  font-size: 36px;
  font-weight: 700;
  color: var(--el-color-danger, #f56c6c);
  line-height: 1;
}

.coupon-item.status-2 .amount,
.coupon-item.status-2 .currency,
.coupon-item.status-3 .amount,
.coupon-item.status-3 .currency {
  color: var(--color-text-placeholder, #c0c4cc);
}

.condition {
  font-size: 12px;
  color: var(--color-text-secondary, #909399);
  margin-top: 8px;
}

/* 分隔线 */
.divider {
  width: 1px;
  background: var(--color-border, #e4e7ed);
}

/* 中间信息区 */
.item-center {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.coupon-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.coupon-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary, #303133);
  margin: 0;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.coupon-tags {
  display: flex;
  gap: 8px;
}

.tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.type-tag {
  background: var(--color-bg-container, #f5f7fa);
  color: var(--color-text-secondary, #909399);
}

.warning-tag {
  background: #fdf6ec;
  color: #e6a23c;
}

.coupon-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-secondary, #909399);
}

.time-icon {
  font-size: 14px;
}

/* 右侧操作区 */
.item-right {
  display: flex;
  align-items: center;
  padding: 20px;
  border-left: 1px solid var(--color-border, #e4e7ed);
}

.use-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background: var(--el-color-primary, #409eff);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.use-btn:hover:not(:disabled) {
  background: var(--el-color-primary-light-3, #66b1ff);
  transform: scale(1.02);
}

.use-btn.disabled {
  background: var(--color-text-placeholder, #c0c4cc);
  cursor: not-allowed;
}

/* 空状态 */
.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  color: var(--color-text-placeholder, #c0c4cc);
  margin-bottom: 16px;
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary, #303133);
  margin: 0 0 8px 0;
}

.empty-desc {
  font-size: 14px;
  color: var(--color-text-secondary, #909399);
  margin: 0 0 20px 0;
}

.empty-action {
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

.empty-action:hover {
  background: var(--el-color-primary-light-3, #66b1ff);
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px 24px;
  border-top: 1px solid var(--color-border, #e4e7ed);
}

/* 使用记录弹窗 */
.record-dialog :deep(.el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border, #e4e7ed);
}

.record-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.record-content {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.record-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  padding: 16px;
  background: var(--color-bg-container, #f5f7fa);
  border-radius: 8px;
}

.record-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.record-coupon {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary, #303133);
}

.record-amount {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-color-danger, #f56c6c);
}

.record-meta {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: var(--color-text-secondary, #909399);
}

.record-order,
.record-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.record-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--color-text-secondary, #909399);
}

.record-empty .empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
  }

  .header-actions {
    width: 100%;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .custom-tabs {
    flex-wrap: wrap;
  }

  .tab-item {
    padding: 8px 16px;
    font-size: 13px;
  }

  .coupon-list {
    padding: 16px;
  }

  .coupon-item {
    flex-direction: column;
  }

  .item-left {
    width: 100%;
    border-right: none;
    border-bottom: 1px dashed var(--color-border, #e4e7ed);
    padding: 16px;
  }

  .divider {
    display: none;
  }

  .item-center {
    padding: 16px;
  }

  .item-right {
    border-left: none;
    border-top: 1px solid var(--color-border, #e4e7ed);
    padding: 16px;
  }

  .use-btn {
    width: 100%;
  }
}
</style>
