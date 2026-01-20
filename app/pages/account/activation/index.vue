<script setup lang="ts">
import {
  activationRecord,
  checkActivation,
  useActivation,
} from '~/api/user/activation.ts'
import type {ActivationTool, ActivationCode} from '~/types/user/activation'
import {isUrl} from '@/utils/is'

definePageMeta({
  layout: 'member'
})
useHead({
  title: '激活码'
})

const message = useMessage()
// 状态管理
const activationCode = ref<string>()
const isCodeChecking = ref(false)
const isLoading = ref(false)
const isCodeError = ref(false)
const availableTools = ref<ActivationTool[]>([])
const selectedToolId = ref<number>()
const activatedCodes = ref<ActivationCode[]>([])
const errorMsg = ref('请输入有效的激活码')
const statusFilter = ref('all')

// 模拟数据加载
const loadActivatedCodes = async () => {
  isLoading.value = true
  try {
    activatedCodes.value = await activationRecord()
  } finally {
    isLoading.value = false
  }
}

// 格式化激活码（大写字母）
const formatActivationCode = () => {
  activationCode.value = activationCode.value?.toUpperCase()
  validateCode(activationCode.value)
}
// 验证激活码格式
const validateCode = (code?: string) => {
  // 1. 校验总长度是否正确
  if (!activationCode.value || !code || code.length !== 12) {
    isCodeError.value = true
    return
  }
  const pattern = /^[A-Za-z0-9]+$/
  isCodeError.value = activationCode.value !== '' && !pattern.test(activationCode.value)
}

// 计算属性：激活码是否有效
const isCodeValid = computed(() => {
  return activationCode.value !== '' && !isCodeError.value
})

// 检查激活码，获取可用工具列表
const checkCode = async () => {
  if (!isCodeValid.value || !activationCode.value) {
    isCodeError.value = true
    return
  }
  isCodeChecking.value = true
  reset()
  try {
    const data = await checkActivation(activationCode.value)
    if (data) {
      availableTools.value = data
      selectedToolId.value = availableTools.value[0].id
    } else {
      errorMsg.value = '该激活码验证结果：无效激活码'
      isCodeError.value = true
      message.error('激活码无效')
    }
  } finally {
    isCodeChecking.value = false
  }
}

// 确认激活选中的工具
const confirmActivation = async () => {
  if (availableTools.value.length === 0) return

  isLoading.value = true
  // 确定要激活的工具
  const targetTool =
      availableTools.value.find((tool) => tool.id === selectedToolId.value) || availableTools.value[0]

  try {
    // 检查是否已激活该工具
    const toolAlreadyActivated = activatedCodes.value.some(
        (item) => item.dataName === targetTool.name && item.codeStatus !== '已过期',
    )
    if (toolAlreadyActivated) {
      message.warning(`工具"${targetTool.name}"已激活，无需重复激活`)
      isLoading.value = false
      return
    }
    await useActivation({
      dataId: selectedToolId.value,
      code: activationCode.value,
    })
    message.success(`工具"${targetTool.name}"激活成功`)
    reset()
    await loadActivatedCodes()
  } catch (e) {
    console.log(e)
  } finally {
    isLoading.value = false
  }
}

// 掩码激活码（只显示前4位和后4位）
const maskCode = (code: string) => {
  if (code.length <= 8) return code
  return code.substring(0, 4) + '****' + code.substring(code.length - 4)
}

// 根据状态返回样式类
const statusClass = (status: string) => {
  switch (status) {
    case '已激活':
      return 'status-normal'
    case '即将过期':
      return 'status-warning'
    case '已过期':
      return 'status-expired'
    default:
      return ''
  }
}

const reset = () => {
  availableTools.value = []
  selectedToolId.value = undefined
  errorMsg.value = '请输入有效的激活码'
}

// 计算属性：是否可以激活
const canActivate = computed(() => {
  if (isLoading.value || isCodeChecking.value) return false
  if (availableTools.value.length === 0) return false
  // 多工具时需要选择一个工具
  return !(availableTools.value.length > 1 && !selectedToolId.value)
})

// 过滤已激活的工具列表
const filteredCodes = computed(() => {
  if (statusFilter.value === 'all') return activatedCodes.value

  const statusMap: Record<string, '正常' | '已过期' | '即将过期'> = {
    normal: '正常',
    expiring: '即将过期',
    expired: '已过期',
  }
  return activatedCodes.value.filter((code) => code.codeStatus === statusMap[statusFilter.value])
})

// 监听激活码变化，自动验证
watch(activationCode, validateCode)

onMounted(() => {
  // 页面加载时获取已激活的激活码
  loadActivatedCodes()
})
</script>

<template>
  <el-card class="ml-3" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <CardTitle title="激活码管理"/>
      </div>
    </template>

    <!-- 激活码输入区域 -->
    <div class="mb-3">
      <el-row>
        <div class="form-group">
          <input
              type="text"
              v-model="activationCode"
              placeholder="请输入激活码"
              @input="formatActivationCode"
              :class="{ error: isCodeError && !isCodeChecking }"
              @keyup.enter="checkCode"
          />
        </div>
        <div class="form-actions ml-3">
          <button
              class="btn check-btn"
              @click="checkCode"
              :disabled="isCodeChecking || !isCodeValid"
          >
            <span v-if="!isCodeChecking">验证</span>
            <Icon v-if="isCodeChecking" class="loading" name="svg-spinners:270-ring"/>
          </button>
          <button
              class="btn activate-btn"
              @click="confirmActivation"
              :disabled="!canActivate || isLoading"
          >
            <span v-if="!isLoading">激活选中工具</span>
            <Icon v-if="isLoading" class="loading" name="svg-spinners:270-ring"/>
          </button>
        </div>
      </el-row>
      <el-row>
        <p class="error-message" v-if="isCodeError && !isCodeChecking">{{ errorMsg }}</p>
        <p class="info-message" v-if="isCodeChecking">正在验证激活码...</p>
        <p class="info-message" v-else></p>
      </el-row>
    </div>

    <!-- 工具选择区域 (当激活码对应多个工具时显示) -->
    <div class="tool-selection" v-if="availableTools.length > 0">
      <div class="selection-header">
        <h3>请选择要激活的工具</h3>
        <p class="selection-desc">此激活码可用于激活以下工具中的一个</p>
      </div>

      <div class="tools-grid">
        <div
            class="tool-card"
            v-for="tool in availableTools"
            :key="tool.id"
            :class="{ selected: selectedToolId === tool.id }"
            @click="selectedToolId = tool.id"
        >
          <div class="tool-icon">
            <template v-if="isUrl(tool.icon)">
              <img :src="tool.icon" alt="Tool Icon" class="w-12 h-12 object-cover"/>
            </template>
            <template v-else>
              <Icon :name="tool.icon"/>
            </template>
          </div>
          <h4 class="tool-name">{{ tool.name }}</h4>
          <p class="tool-desc line-clamp-3">{{ tool.description }}</p>
          <!--          <div class="tool-expiry">-->
          <!--            <span>有效期: {{ tool.validityPeriod }}</span>-->
          <!--          </div>-->
          <Icon
              v-if="selectedToolId === tool.id"
              name="ep:circle-check"
              class="selection-indicator"
              :size="22"
          />
        </div>
      </div>
    </div>

    <!-- 激活码列表 -->
    <div class="activation-list-section mt-6">
      <div class="section-header">
        <h2 class="section-title">已激活的工具</h2>
        <div class="filter-controls">
          <select v-model="statusFilter" class="status-filter">
            <option value="all">全部状态</option>
            <option value="normal">正常</option>
            <option value="expiring">即将过期</option>
            <option value="expired">已过期</option>
          </select>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="filteredCodes.length === 0 && !isLoading">
        <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M12 8V12L15 15"
              stroke="#cbd5e1"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
          <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              stroke="#cbd5e1"
              stroke-width="2"
          />
        </svg>
        <p>暂无已激活的工具</p>
        <p class="empty-subtitle">输入激活码激活工具后，将显示在这里</p>
      </div>

      <!-- 激活码列表 -->
      <div class="codes-list" v-if="filteredCodes.length > 0 && !isLoading">
        <div class="code-item header">
          <div class="code-col code-name">工具名称</div>
          <div class="code-col code-key">激活码</div>
          <div class="code-col code-status">状态</div>
          <div class="code-col code-expiry">激活时间</div>
          <!--          <div class="code-col code-expiry">有效期至</div>-->
        </div>
        <div
            class="code-item"
            v-for="(code, index) in filteredCodes"
            :key="index"
            :class="{ expired: code.codeStatus === '已过期' }"
        >
          <div class="code-col code-name ">
            <div class="flex items-center">
              <div class="mr-2">
                <template v-if="isUrl(code.dataLogo)">
                  <img :src="code.dataLogo" alt="Tool Icon" class="w-6 h-6 object-cover"/>
                </template>
                <template v-else>
                  <Icon :name="code.dataLogo"/>
                </template>
              </div>
              <el-link @click="navigateTo( `/t/${code.dataInfo}`)">{{ code.dataName }}</el-link>
            </div>
          </div>
          <div class="code-col code-key">
            <span class="masked-code">{{ maskCode(code.code) }}</span>
          </div>
          <div class="code-col code-status">
            <span :class="statusClass(code.codeStatus)">{{ code.codeStatus }}</span>
          </div>
          <div class="code-col code-expiry">{{ formatDate(code.activatedTime) }}</div>
          <!--          <div class="code-col code-expiry">{{ formatDate(code.expiryDate) }}</div>-->
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.form-group {
  flex: 1;
  min-width: 300px;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.error {
  border-color: #ef4444;
}

.error-message {
  margin: 0.5rem 0 0 0;
  color: #ef4444;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  height: 20px;
}

.info-message {
  margin: 0.5rem 0 0 0;
  color: #64748b;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  height: 20px;
}

/* 按钮样式 */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.check-btn {
  background-color: #f1f5f9;
  color: #334155;
}

.check-btn:hover:not(:disabled) {
  background-color: #e2e8f0;
}

.check-btn:disabled {
  background-color: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.activate-btn {
  background-color: #3b82f6;
  color: #fff;
  white-space: nowrap;
}

.activate-btn:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.activate-btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.action-btn {
  background-color: #f1f5f9;
  color: #334155;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.action-btn:hover {
  background-color: #e2e8f0;
}

.close-modal-btn {
  background-color: #f1f5f9;
  color: #334155;
}

.close-modal-btn:hover {
  background-color: #e2e8f0;
}

/* 工具选择区域 */
.tool-selection {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed #e2e8f0;
}

.selection-header {
  margin-bottom: 1.5rem;
}

.selection-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #1e293b;
}

.selection-desc {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.tool-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.tool-card:hover {
  border-color: #93c5fd;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
  transform: translateY(-3px);
}

.tool-card.selected {
  border-color: #3b82f6;
  background-color: #f8fafc;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.tool-card.selected::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: #3b82f6;
}

.tool-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  color: #3b82f6;
}

.tool-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #1e293b;
}

.tool-desc {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
}

.tool-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.feature-tag {
  background-color: #eff6ff;
  color: #3b82f6;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.feature-tag.more {
  background-color: #f1f5f9;
  color: #64748b;
}

.tool-expiry {
  font-size: 0.85rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.tool-expiry svg {
  width: 14px;
  height: 14px;
  color: #94a3b8;
}

.selection-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-info-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #1e293b;
}

/* 激活码列表区域 */
.activation-list-section {
  background-color: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  border: dashed 1px gainsboro;
  margin-top: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.status-filter {
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #334155;
  font-size: 0.875rem;
  cursor: pointer;
}

.status-filter:focus {
  outline: none;
  border-color: #3b82f6;
}

/* 列表样式 */
.codes-list {
  border-radius: 0.5rem;
  overflow: hidden;
}

.code-item {
  display: flex;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
}

.code-item:last-child {
  border-bottom: none;
}

.code-item:hover:not(.header) {
  background-color: #f8fafc;
}

.code-item.header {
  background-color: #f8fafc;
  font-weight: 600;
  color: #64748b;
}

.code-col {
  padding: 1rem;
  flex: 1;
}

.code-name {
  flex: 1.2;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.tool-icon {
  color: #3b82f6;
  min-width: 24px;
}

.code-key {
  flex: 2;
  position: relative;
}

.masked-code {
  color: #334155;
}

.copy-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
  vertical-align: middle;
  transition: color 0.2s;
}

.copy-btn:hover {
  color: #3b82f6;
}

.code-status {
  flex: 0.8;
}

.code-expiry {
  flex: 1;
}

.code-action {
  flex: 0.7;
}

/* 状态样式 */
.status-normal {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-warning {
  color: #f59e0b;
  background-color: rgba(245, 158, 11, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-expired {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.code-item.expired {
  opacity: 0.7;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #94a3b8;
}

.empty-state svg {
  margin-bottom: 1rem;
  color: #cbd5e1;
}

.empty-subtitle {
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: #94a3b8;
}

/* 弹窗样式 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.modal-backdrop:not([v-if='false']) {
  opacity: 1;
  visibility: visible;
}

.modal {
  background-color: #fff;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
  0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-20px);
  transition: transform 0.3s;
}

.modal-backdrop:not([v-if='false']) .modal {
  transform: translateY(0);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #334155;
}

.modal-body {
  padding: 1.5rem;
}

.detail-item {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.detail-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.detail-label {
  display: inline-block;
  width: 90px;
  color: #64748b;
  font-weight: 500;
}

.detail-value {
  color: #1e293b;
}

.features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* 提示框样式 */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(200%);
  background-color: #1e293b;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  z-index: 1000;
  transition: transform 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.toast.show {
  transform: translateX(-50%) translateY(0);
}

/* 加载动画 */
.loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 页脚样式 */
.page-footer {
  background-color: #fff;
  border-top: 1px solid #e2e8f0;
  padding: 1.5rem 2rem;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.footer-content p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.875rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: #64748b;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #3b82f6;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .sidebar-menu {
    display: flex;
    overflow-x: auto;
  }

  .menu-item {
    margin-bottom: 0;
    margin-right: 0.5rem;
  }

  .menu-item a {
    padding: 0.5rem 1rem;
  }

  .menu-item.active a {
    border-left: none;
    border-bottom: 3px solid #3b82f6;
  }
}

@media (max-width: 768px) {
  .form-actions {
    width: 100%;
    justify-content: space-between;
  }

  .btn {
    flex: 1;
    padding: 0.75rem;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }

  .code-item {
    flex-wrap: wrap;
  }

  .code-col {
    flex: 100% !important;
    padding: 0.75rem;
  }

  .code-item.header {
    display: none;
  }

  .code-col::before {
    content: attr(data-label);
    display: block;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
  }

  .code-name {
    data-label: '工具名称';
  }

  .code-key {
    data-label: '激活码';
  }

  .code-status {
    data-label: '状态';
  }

  .code-expiry {
    data-label: '有效期至';
  }

  .code-action {
    data-label: '操作';
  }
}
</style>
