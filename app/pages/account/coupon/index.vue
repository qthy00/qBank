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

const getStatusType = (status: number) => {
  switch (status) {
    case UserCouponStatusEnum.UNUSED:
      return 'success'
    case UserCouponStatusEnum.USED:
      return 'info'
    case UserCouponStatusEnum.EXPIRED:
      return 'danger'
    default:
      return ''
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
  <el-card class="ml-3" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <CardTitle title="我的优惠券"/>
        <div class="flex gap-2">
          <el-button type="primary" plain size="small" @click="navigateTo('/coupon')">
            <Icon name="ep:plus" class="mr-1" />
            去领券
          </el-button>
          <el-button type="info" plain size="small" @click="showUsageHistory">
            <Icon name="ep:clock" class="mr-1" />
            使用记录
          </el-button>
        </div>
      </div>
    </template>

    <!-- 标签页 -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="coupon-tabs">
      <el-tab-pane :label="`未使用 (${getTabCount(1)})`" :name="1">
        <div v-loading="loading" class="coupon-list">
          <div
            v-for="coupon in filteredCoupons"
            :key="coupon.id"
            class="my-coupon-card"
            :class="{ 'expiring': coupon.isExpiringSoon }"
          >
            <div class="coupon-main">
              <div class="coupon-info">
                <div class="coupon-header-row">
                  <h3 class="coupon-title">{{ coupon.couponName }}</h3>
                  <el-tag :type="getStatusType(coupon.status)" size="small">
                    {{ getStatusText(coupon.status) }}
                  </el-tag>
                </div>
                <div class="coupon-amount-row">
                  <span class="amount-label">优惠金额：</span>
                  <span class="amount-value">¥{{ fen2yuan(coupon.discountAmount) }}</span>
                  <span v-if="coupon.minAmount > 0" class="amount-condition">
                    (满¥{{ fen2yuan(coupon.minAmount) }}可用)
                  </span>
                </div>
                <div class="coupon-meta">
                  <span class="meta-item">
                    <Icon name="ep:tag" />
                    {{ getTypeText(coupon.type) }}
                  </span>
                  <span class="meta-item">
                    <Icon name="ep:calendar" />
                    有效期：{{ formatDate(coupon.validStartTime) }} 至 {{ formatDate(coupon.validEndTime) }}
                  </span>
                </div>
                <el-alert
                  v-if="coupon.isExpiringSoon"
                  title="即将过期，请尽快使用"
                  type="warning"
                  :closable="false"
                  show-icon
                  class="expiring-alert"
                />
              </div>
              <div class="coupon-action">
                <el-button
                  type="primary"
                  size="default"
                  @click="handleUse(coupon)"
                >
                  立即使用
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="`已使用 (${getTabCount(2)})`" :name="2">
        <div v-loading="loading" class="coupon-list">
          <div
            v-for="coupon in filteredCoupons"
            :key="coupon.id"
            class="my-coupon-card used"
          >
            <div class="coupon-main">
              <div class="coupon-info">
                <div class="coupon-header-row">
                  <h3 class="coupon-title">{{ coupon.couponName }}</h3>
                  <el-tag type="info" size="small">已使用</el-tag>
                </div>
                <div class="coupon-amount-row">
                  <span class="amount-label">优惠金额：</span>
                  <span class="amount-value used">¥{{ fen2yuan(coupon.discountAmount) }}</span>
                </div>
                <div class="coupon-meta">
                  <span class="meta-item">
                    <Icon name="ep:tag" />
                    {{ getTypeText(coupon.type) }}
                  </span>
                  <span class="meta-item">
                    <Icon name="ep:clock" />
                    使用时间：{{ formatDateTime(coupon.useTime) }}
                  </span>
                </div>
              </div>
              <div class="coupon-action">
                <el-button type="info" plain size="default" disabled>
                  已使用
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="`已过期 (${getTabCount(3)})`" :name="3">
        <div v-loading="loading" class="coupon-list">
          <div
            v-for="coupon in filteredCoupons"
            :key="coupon.id"
            class="my-coupon-card expired"
          >
            <div class="coupon-main">
              <div class="coupon-info">
                <div class="coupon-header-row">
                  <h3 class="coupon-title">{{ coupon.couponName }}</h3>
                  <el-tag type="danger" size="small">已过期</el-tag>
                </div>
                <div class="coupon-amount-row">
                  <span class="amount-label">优惠金额：</span>
                  <span class="amount-value expired">¥{{ fen2yuan(coupon.discountAmount) }}</span>
                </div>
                <div class="coupon-meta">
                  <span class="meta-item">
                    <Icon name="ep:tag" />
                    {{ getTypeText(coupon.type) }}
                  </span>
                  <span class="meta-item">
                    <Icon name="ep:calendar" />
                    过期时间：{{ formatDate(coupon.validEndTime) }}
                  </span>
                </div>
              </div>
              <div class="coupon-action">
                <el-button type="danger" plain size="default" disabled>
                  已过期
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 空状态 -->
    <div v-if="!loading && filteredCoupons.length === 0" class="empty-state">
      <el-empty description="暂无优惠券">
        <template #image>
          <Icon name="ep:ticket" class="empty-icon" />
        </template>
        <el-button type="primary" @click="navigateTo('/coupon')">
          去领券中心
        </el-button>
      </el-empty>
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
    width="700px"
    destroy-on-close
  >
    <div v-loading="recordLoading" class="record-list">
      <el-table :data="usageRecords" style="width: 100%">
        <el-table-column prop="couponName" label="优惠券" min-width="120" />
        <el-table-column prop="orderNo" label="订单编号" min-width="140" />
        <el-table-column label="优惠金额" width="100">
          <template #default="{ row }">
            <span class="text-red-500">-¥{{ fen2yuan(row.discountAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.useTime) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="usageRecords.length === 0 && !recordLoading" class="record-empty">
      <el-empty description="暂无使用记录" />
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.coupon-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 20px;
  }
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.my-coupon-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.my-coupon-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.my-coupon-card.expiring {
  border-color: #f59e0b;
  background: linear-gradient(to right, #fffbeb, #ffffff);
}

.my-coupon-card.used {
  opacity: 0.8;
  background: #f9fafb;
}

.my-coupon-card.expired {
  opacity: 0.6;
  background: #f9fafb;
}

.coupon-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.coupon-info {
  flex: 1;
}

.coupon-header-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.coupon-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.coupon-amount-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
}

.amount-label {
  font-size: 14px;
  color: #6b7280;
}

.amount-value {
  font-size: 24px;
  font-weight: 700;
  color: #ef4444;
}

.amount-value.used {
  color: #9ca3af;
}

.amount-value.expired {
  color: #9ca3af;
}

.amount-condition {
  font-size: 13px;
  color: #9ca3af;
}

.coupon-meta {
  display: flex;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #6b7280;
}

.expiring-alert {
  margin-top: 12px;
}

.coupon-action {
  flex-shrink: 0;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.record-list {
  min-height: 200px;
}

.record-empty {
  padding: 40px;
}

:deep(.el-dialog__body) {
  padding-top: 10px;
}
</style>
