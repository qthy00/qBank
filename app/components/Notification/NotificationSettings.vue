<template>
  <div class="notification-settings">
    <h3 class="text-lg font-semibold mb-4 text-gray-800">消息设置</h3>

    <div class="space-y-4">
      <!-- 系统通知 -->
      <div class="setting-item flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Icon name="ep:monitor" class="text-blue-600" :size="20" />
          </div>
          <div>
            <h4 class="font-medium text-gray-800">系统通知</h4>
            <p class="text-xs text-gray-500">账户安全、系统公告等重要消息</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <el-switch
            v-model="settings.system.push"
            active-text="推送"
            @change="updateSetting('system', 'push', $event)"
          />
          <el-switch
            v-model="settings.system.enabled"
            @change="updateSetting('system', 'enabled', $event)"
          />
        </div>
      </div>

      <!-- 订单通知 -->
      <div class="setting-item flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Icon name="ep:shopping-bag" class="text-amber-600" :size="20" />
          </div>
          <div>
            <h4 class="font-medium text-gray-800">订单通知</h4>
            <p class="text-xs text-gray-500">订单状态、支付结果、退款提醒</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <el-switch
            v-model="settings.order.push"
            active-text="推送"
            @change="updateSetting('order', 'push', $event)"
          />
          <el-switch
            v-model="settings.order.enabled"
            @change="updateSetting('order', 'enabled', $event)"
          />
        </div>
      </div>

      <!-- 活动通知 -->
      <div class="setting-item flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Icon name="ep:gift" class="text-purple-600" :size="20" />
          </div>
          <div>
            <h4 class="font-medium text-gray-800">活动通知</h4>
            <p class="text-xs text-gray-500">优惠活动、限时促销、新功能上线</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <el-switch
            v-model="settings.activity.push"
            active-text="推送"
            @change="updateSetting('activity', 'push', $event)"
          />
          <el-switch
            v-model="settings.activity.enabled"
            @change="updateSetting('activity', 'enabled', $event)"
          />
        </div>
      </div>

      <!-- 学习通知 -->
      <div class="setting-item flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Icon name="ep:reading" class="text-green-600" :size="20" />
          </div>
          <div>
            <h4 class="font-medium text-gray-800">学习通知</h4>
            <p class="text-xs text-gray-500">学习提醒、打卡通知、考试提醒</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <el-switch
            v-model="settings.study.push"
            active-text="推送"
            @change="updateSetting('study', 'push', $event)"
          />
          <el-switch
            v-model="settings.study.enabled"
            @change="updateSetting('study', 'enabled', $event)"
          />
        </div>
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <div class="flex items-start gap-2">
        <Icon name="ep:info-filled" class="text-blue-600 mt-0.5" :size="16" />
        <p class="text-sm text-blue-700">
          关闭通知后将不再接收该类消息，但系统通知（账户安全相关）建议保持开启以确保账户安全。
        </p>
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="mt-6 flex justify-end">
      <el-button type="primary" :loading="saving" @click="saveSettings">
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
