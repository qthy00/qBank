<template>
  <div class="notification-settings">
    <!-- 设置项列表 -->
    <div class="settings-list">
      <!-- 系统通知 -->
      <div class="setting-item">
        <div class="item-info">
          <div class="info-icon system">
            <Icon name="ep:monitor" />
          </div>
          <div class="info-content">
            <h4 class="info-title">系统通知</h4>
            <p class="info-desc">账户安全、系统公告等重要消息</p>
          </div>
        </div>
        <div class="item-controls">
          <div class="control-group">
            <span class="control-label">推送</span>
            <el-switch
              v-model="settings.system.push"
              @change="updateSetting('system', 'push', $event)"
            />
          </div>
          <div class="control-group">
            <span class="control-label">启用</span>
            <el-switch
              v-model="settings.system.enabled"
              @change="updateSetting('system', 'enabled', $event)"
            />
          </div>
        </div>
      </div>

      <!-- 订单通知 -->
      <div class="setting-item">
        <div class="item-info">
          <div class="info-icon order">
            <Icon name="ep:shopping-bag" />
          </div>
          <div class="info-content">
            <h4 class="info-title">订单通知</h4>
            <p class="info-desc">订单状态、支付结果、退款提醒</p>
          </div>
        </div>
        <div class="item-controls">
          <div class="control-group">
            <span class="control-label">推送</span>
            <el-switch
              v-model="settings.order.push"
              @change="updateSetting('order', 'push', $event)"
            />
          </div>
          <div class="control-group">
            <span class="control-label">启用</span>
            <el-switch
              v-model="settings.order.enabled"
              @change="updateSetting('order', 'enabled', $event)"
            />
          </div>
        </div>
      </div>

      <!-- 活动通知 -->
      <div class="setting-item">
        <div class="item-info">
          <div class="info-icon activity">
            <Icon name="ep:gift" />
          </div>
          <div class="info-content">
            <h4 class="info-title">活动通知</h4>
            <p class="info-desc">优惠活动、限时促销、新功能上线</p>
          </div>
        </div>
        <div class="item-controls">
          <div class="control-group">
            <span class="control-label">推送</span>
            <el-switch
              v-model="settings.activity.push"
              @change="updateSetting('activity', 'push', $event)"
            />
          </div>
          <div class="control-group">
            <span class="control-label">启用</span>
            <el-switch
              v-model="settings.activity.enabled"
              @change="updateSetting('activity', 'enabled', $event)"
            />
          </div>
        </div>
      </div>

      <!-- 学习通知 -->
      <div class="setting-item">
        <div class="item-info">
          <div class="info-icon study">
            <Icon name="ep:reading" />
          </div>
          <div class="info-content">
            <h4 class="info-title">学习通知</h4>
            <p class="info-desc">学习提醒、打卡通知、考试提醒</p>
          </div>
        </div>
        <div class="item-controls">
          <div class="control-group">
            <span class="control-label">推送</span>
            <el-switch
              v-model="settings.study.push"
              @change="updateSetting('study', 'push', $event)"
            />
          </div>
          <div class="control-group">
            <span class="control-label">启用</span>
            <el-switch
              v-model="settings.study.enabled"
              @change="updateSetting('study', 'enabled', $event)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="info-tip">
      <div class="tip-icon">
        <Icon name="ep:info-filled" />
      </div>
      <p class="tip-text">
        关闭通知后将不再接收该类消息，但系统通知（账户安全相关）建议保持开启以确保账户安全。
      </p>
    </div>

    <!-- 保存按钮 -->
    <div class="actions">
      <el-button type="primary" size="large" :loading="saving" @click="saveSettings">
        <Icon name="ep:check" class="btn-icon" />
        保存设置
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NotificationSettingVO, NotificationType } from '~/types/notification'
import { useNotificationStore } from '~/stores/notification'

const notificationStore = useNotificationStore()
const message = useMessage()

const saving = ref(false)

/* ==================== 本地设置状态 ==================== */
const settings = reactive<Record<NotificationType, { enabled: boolean; push: boolean }>>({
  system: { enabled: true, push: true },
  order: { enabled: true, push: true },
  activity: { enabled: true, push: true },
  study: { enabled: true, push: true }
})

/* ==================== 方法 ==================== */
const updateSetting = (type: NotificationType, key: 'enabled' | 'push', value: boolean) => {
  settings[type][key] = value
}

const saveSettings = async () => {
  saving.value = true
  try {
    const settingData: NotificationSettingVO[] = [
      { type: 'system', enabled: settings.system.enabled, pushEnabled: settings.system.push },
      { type: 'order', enabled: settings.order.enabled, pushEnabled: settings.order.push },
      { type: 'activity', enabled: settings.activity.enabled, pushEnabled: settings.activity.push },
      { type: 'study', enabled: settings.study.enabled, pushEnabled: settings.study.push }
    ]

    await notificationStore.updateSettings(settingData)
    message.success('设置已保存')
  } catch (error) {
    message.error('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

/* ==================== 初始化 ==================== */
const initSettings = async () => {
  const serverSettings = await notificationStore.fetchSettings()
  if (serverSettings && serverSettings.length > 0) {
    serverSettings.forEach(setting => {
      if (settings[setting.type]) {
        settings[setting.type].enabled = setting.enabled
        settings[setting.type].push = setting.pushEnabled
      }
    })
  }
}

onMounted(() => {
  initSettings()
})
</script>

<style scoped lang="scss">
.notification-settings {
  padding: 8px 0;
}

/* 设置项列表 */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
  transition: all 0.2s ease;
  gap: 16px;

  &:hover {
    border-color: var(--el-border-color);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }
}

.item-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.info-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;

  &.system {
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }

  &.order {
    background: var(--el-color-warning-light-9);
    color: var(--el-color-warning);
  }

  &.activity {
    background: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
  }

  &.study {
    background: var(--el-color-success-light-9);
    color: var(--el-color-success);
  }
}

.info-content {
  flex: 1;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 6px;
}

.info-desc {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 24px;
}

.control-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.control-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* 提示信息 */
.info-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 24px;
  padding: 16px;
  border-radius: 10px;
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-7);
}

.tip-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  font-size: 18px;
  color: var(--el-color-primary);
  margin-top: 1px;
}

.tip-text {
  flex: 1;
  font-size: 13px;
  color: var(--el-color-primary-dark-2);
  line-height: 1.6;
}

/* 操作按钮 */
.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-icon {
  margin-right: 6px;
  font-size: 16px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
  }

  .item-controls {
    width: 100%;
    justify-content: flex-end;
    border-top: 1px solid var(--el-border-color-lighter);
    padding-top: 16px;
    margin-top: 12px;
  }

  .info-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .info-title {
    font-size: 15px;
  }

  .actions {
    justify-content: center;
  }
}
</style>
