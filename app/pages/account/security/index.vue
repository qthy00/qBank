<template>
  <div class="ml-3 p-6 bg-white rounded-xl space-y-6">
    <!-- 安全概览 -->
    <el-card shadow="never" class="border border-gray-200">
      <template #header>
        <CardTitle title="安全概览" />
      </template>
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm text-gray-700">您的账户安全等级</div>
          <div class="text-xs text-gray-500 mt-1">建议完成以下安全设置以增强您的账户安全性</div>
        </div>
        <div class="flex items-center gap-4">
          <el-progress
            :show-text="false"
            :percentage="securityData?.totalScore || 0"
            :stroke-width="14"
            :color="levelColor"
            style="width: 180px"
          />
          <div class="text-pink-500 font-bold">
            {{ securityData?.totalScore || 0 }} 分

            <span :style="`color: ${levelColor}`">{{ securityData?.level }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 安全设置 -->
    <el-card shadow="never" class="border border-gray-200">
      <template #header>
        <CardTitle title="安全设置" />
      </template>
      <div class="space-y-7">
        <SettingRow icon="ep:key" title="密码管理" desc="设置和修改您的账户密码">
          <el-button
            class="rounded-2xl"
            type="warning"
            plain
            size="small"
            @click="handlePasswordChange"
          >
            修改密码
          </el-button>
        </SettingRow>

        <SettingRow icon="ep:message" title="邮箱绑定" :desc="`已绑定邮箱：${email}`">
          <el-button
            class="rounded-2xl"
            :type="email ? 'warning' : 'primary'"
            plain
            size="small"
            @click="handleEmailChange"
          >
            {{ email ? '换绑邮箱' : '绑定邮箱' }}
          </el-button>
        </SettingRow>

        <!--        <SettingRow icon="ep:iphone" title="手机绑定" :desc="`已绑定手机：${mobile}`">-->
        <!--          <el-button-->
        <!--            class="rounded-2xl"-->
        <!--            :type="mobile ? 'warning' : 'primary'"-->
        <!--            plain-->
        <!--            size="small"-->
        <!--            @click="handleMobileChange"-->
        <!--          >-->
        <!--            {{ mobile ? '换绑手机' : '绑定手机' }}-->
        <!--          </el-button>-->
        <!--        </SettingRow>-->

        <SettingRow icon="mage:id-card" title="实名认证" :desc="`${realName}实名认证`">
          <el-button
            class="rounded-2xl"
            type="primary"
            plain
            size="small"
            :disabled="isRealName"
            @click="handleRealName"
          >
            {{ isRealName ? '您已认证' : '立即认证' }}
          </el-button>
        </SettingRow>

<!--        <SettingRow icon="ep:monitor" title="登录设备管理" desc="管理您的活跃登录设备">-->
<!--          <el-switch-->
<!--            v-show="!setting.deviceManagement"-->
<!--            v-model="setting.deviceManagement"-->
<!--            :loading="loadingUpdate"-->
<!--            inline-prompt-->
<!--            active-text="已开启"-->
<!--            inactive-text="未开启"-->
<!--            @change="handleSettingChange('deviceManagement')"-->
<!--          />-->
<!--          <template v-if="setting.deviceManagement">-->
<!--            <el-button class="rounded-2xl" type="primary" plain size="small" @click="viewDevices">-->
<!--              查看设备-->
<!--            </el-button>-->
<!--          </template>-->
<!--        </SettingRow>-->

        <SettingRow icon="stash:shield-duotone" title="两步验证" desc="增强账户登录安全">
          <el-switch
            v-model="setting.twoFactor"
            :loading="loadingUpdate"
            inline-prompt
            active-text="已开启"
            inactive-text="未开启"
            @change="handleSettingChange('twoFactor')"
          />
        </SettingRow>

        <SettingRow icon="basil:notification-on-outline" title="安全通知" desc="异常登录和安全提醒">
          <el-switch
            v-model="setting.securityNotify"
            :loading="loadingUpdate"
            inline-prompt
            active-text="已开启"
            inactive-text="未开启"
            @change="handleSettingChange('securityNotify')"
          />
        </SettingRow>

        <SettingRow icon="solar:broom-bold" title="清空缓存" desc="清除本地缓存数据，解决数据异常问题">
          <el-button
            class="rounded-2xl"
            type="danger"
            plain
            size="small"
            @click="handleClearCache"
          >
            立即清空
          </el-button>
        </SettingRow>
      </div>
    </el-card>

<!--     第三方账号绑定-->
        <el-card shadow="never" class="border border-gray-200">
          <template #header>
            <CardTitle title="第三方账号绑定" />
          </template>
          <div class="space-y-4">
            <SettingRow icon="fa:weixin" color="green" title="微信" :desc="isBindWechat ? '已绑定' : '未绑定'">
              <el-button
                type="primary"
                plain
                size="small"
                :disabled="isBindWechat"
                @click="bindWeChat"
              >
                {{ isBindWechat ? '已绑定' : '绑定' }}
              </el-button>
            </SettingRow>
<!--            <SettingRow icon="ri:qq-line" title="QQ" :desc="`已绑定至 ${maskQQ(userInfo.qq)}`">-->
<!--              <el-button size="small" disabled>已绑定</el-button>-->
<!--            </SettingRow>-->
<!--            <SettingRow icon="ri:weibo-fill" color="#A90606" title="微博" desc="未绑定">-->
<!--              <el-button type="primary" plain size="small">绑定</el-button>-->
<!--            </SettingRow>-->
            <div class="text-xs text-gray-500 pt-2">
              通过绑定第三方账号，您可以更快捷地登录及获得更多社交功能。每个账号只可绑定一个平台账号，解绑需重新验证。
            </div>
          </div>
        </el-card>

  </div>
  <ChangePasswordForm ref="changePasswordForm" />
  <ChangeEmailForm ref="changeEmailForm" @success="handleEmailSuccess" />
  <ChangePhoneForm ref="changeMobileForm" @success="handleMobileSuccess" />
  <CertificationForm ref="certificationForm" @success="handleRealNameSuccess" />
  <DeviceList ref="deviceListRef" @close="handleDeviceClose"/>
  <WechatBindForm ref="wechatBindRef" />
</template>

<script setup lang="ts">
import {
  fetchSecurityScore,
  updateUserSetting,
} from '@/api/user'
import ChangePasswordForm from '@/views/account/security/ChangePasswordForm.vue'
import CertificationForm from '@/views/account/security/CertificationForm.vue'
import ChangeEmailForm from '@/views/account/security/ChangeEmailForm.vue'
import ChangePhoneForm from '@/views/account/security/ChangePhoneForm.vue'
import SettingRow from '@/views/account/security/SettingRow.vue'
import DeviceList from '@/views/account/security/DeviceList.vue'
import WechatBindForm from '@/components/WechatBindForm.vue'
import { SocialApi } from '@/api/user/social.ts'
import { maskEmail, maskPhone } from '@/utils'

definePageMeta({
  layout: 'member'
})
useHead({
  title: '安全中心'
})

const message = useMessage()
const authStore = useAuthStore()
const router = useRouter()

const securityData = ref<SecurityDataVO>()
const levelColor = ref('')
const mobile = ref('')
const email = ref('')
const realName = ref('未完成')
const isRealName = ref(false)
const loadingUpdate = ref(false)
const setting = reactive({
  deviceManagement: false,
  securityNotify: false,
  twoFactor: false,
})
const isBindWechat = ref(false)

const loadSecurityScore = async () => {
  try {
    const data = await fetchSecurityScore()
    securityData.value = data
    if (data.totalScore >= 90) {
      levelColor.value = '#13ce66'
    } else if (data.totalScore >= 60) {
      levelColor.value = '#ff9900'
    } else {
      levelColor.value = '#ff4949'
    }
    data.items.forEach((item: SecurityItem) => {
      switch (item.key) {
        case 'mobile':
          mobile.value = item.value
          break
        case 'email':
          email.value = item.value
          break
        case 'realName':
          isRealName.value = item.value === 'true'
          realName.value = isRealName.value ? '已完成' : '未完成'
          break
        case 'twoFactor':
          setting.twoFactor = item.value === 'true'
          break
        case 'securityNotify':
          setting.securityNotify = item.value === 'true'
          break
        case 'deviceManagement':
          setting.deviceManagement = item.value === 'true'
          break
        default:
          break
      }
    })
  } catch (error) {
    message.error('加载安全分数失败')
  }
}
// 修改密码
const changePasswordForm = ref()
const handlePasswordChange = () => {
  changePasswordForm.value!.open()
}
// 绑定邮箱
const changeEmailForm = ref()
const handleEmailChange = () => {
  changeEmailForm.value!.open()
}
const handleEmailSuccess = (e: string) => {
  email.value = maskEmail(e)
}
// 绑定手机
const changeMobileForm = ref()
const handleMobileChange = () => {
  changeMobileForm.value!.open()
}
const handleMobileSuccess = (e: string) => {
  mobile.value = maskPhone(e)
}
// 实名认证
const certificationForm = ref()
const handleRealName = () => {
  certificationForm.value!.open()
}
const handleRealNameSuccess = () => {
  realName.value = '已完成'
  isRealName.value = true
}
// 管理设置开关
const handleSettingChange = async (type: string) => {
  loadingUpdate.value = true
  try {
    const data = {}
    data[type] = setting[type]
    await updateUserSetting(data)
  } catch (e) {
    setting[type] = !setting[type]
    message.error('设置失败：' + e)
  } finally {
    loadingUpdate.value = false
  }
}

// 设备管理
const deviceListRef = ref()
const viewDevices = () => {
  deviceListRef.value!.open()
}
const handleDeviceClose = () => {

}

const wechatBindRef = ref()
const bindWeChat = () => {
  wechatBindRef.value!.open()
}
const loadSocialInfo = async () => {
  try{
    const socialInfo = await SocialApi.getSocialUserList()
    if(socialInfo.length > 0){
      if(socialInfo.includes(32) || socialInfo.includes(31)){
        isBindWechat.value = true
      }
    }
  }catch (e){
    console.log(e)
  }
}

/* 清空缓存 */
const handleClearCache = () => {
  ElMessageBox.confirm(
    '确定要清空所有缓存数据吗？这将清除本地存储的所有数据（除登录账号外），需要重新登录。',
    '清空缓存',
    {
      confirmButtonText: '确定清空',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(() => {
    const result = authStore.clearAllCache()
    if (result) {
      /* 清空后跳转到登录页 */
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    }
  }).catch(() => {
    /* 用户取消 */
  })
}

onMounted(() => {
  loadSecurityScore()
  loadSocialInfo()
})
</script>

<style scoped></style>
