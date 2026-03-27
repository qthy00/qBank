<script setup lang="ts">
import { formatPast } from '~/utils/formatTime.ts'
import { fetchCurrentDevice, fetchDevicePage } from '~/api/user'
import type { DeviceItem } from '~/types/user'

const phoneIcon = useIcon({
  name: 'ep:iphone',
  size: 25,
})

const tabletIcon = useIcon({
  name: 'mdi:tablet-ipad',
  size: 25,
})

const computerIcon = useIcon({
  name: 'ep:monitor',
  size: 25,
})

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false)
const message = useMessage()
const currentDevice = ref<DeviceItem>({
  id: 0,
  browser: 'Safari 16.4',
  os: 'iOS 16.4',
  area: '上海市',
  ip: '113.140.23.122',
  loginTime: '2小时前',
  icon: phoneIcon,
  trusted: true
})
const devices = ref<DeviceItem[]>([])
const width = ref('60%')


/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  await Promise.all([loadCurrentDevice(), loadDevicesList()])
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const loadCurrentDevice = async () => {
  try{
    currentDevice.value = await fetchCurrentDevice()
  }catch (e){}
}
const params = reactive({
  pageNo: 1,
  pageSize: 10,
})
const total = ref(0)
const loadDevicesList = async () => {
  try{
    const data = await fetchDevicePage(params)
    devices.value = data.list
    devices.value.forEach((item) => {
      if (item.os === 'Windows' || item.os === 'Mac OS X') {
        item.icon = computerIcon
      } else if (item.os === 'iOS') {
        item.icon = tabletIcon
      } else if(item.os === 'Android') {
        item.icon = phoneIcon
      }
    })
    total.value = data.total
  }catch (e){}
}


const emit = defineEmits(['close'])
const logoutAll = async () => {
  // 校验表单


  formLoading.value = false
  try {
    // await verifyRealName(formData.value)
    // message.notifySuccess('认证成功')
    dialogVisible.value = false
    emit('close')
  } catch (e) {
    message.error('认证失败：' + e)
  } finally {
    formLoading.value = false
  }
}

const handleTrust = async (id: number) => {
  console.log(id)
}

</script>

<template>
  <Dialog v-model="dialogVisible" title="登录设备管理" :width="width">
    <div class="text-sm text-gray-500 font-bold mb-5">管理并查看您账户的所有登录设备</div>
        <div class="space-y-4 max-h-[70vh] overflow-auto">
          <!-- 当前设备 -->
          <div class="bg-blue-50 border border-solid border-blue-500 relative p-5 rounded-lg border ">
            <div class="absolute top-0 right-0 bg-indigo-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
              当前设备
            </div>
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <el-avatar :icon="currentDevice.icon" size="large" class="bg-blue-100 text-blue-600" />
                <div>
                  <div class="text-base font-medium text-gray-800">{{currentDevice.os}}</div>
                  <div class="text-xs text-gray-500">{{currentDevice.browser}} · {{currentDevice.os}} · {{currentDevice.area}}</div>
                  <div class="text-xs text-gray-400">IP: {{currentDevice.ip}} · {{currentDevice.trusted ? '已信任' : '未信任'}}</div>
                </div>
              </div>
              <div class="text-xs text-blue-600 flex flex-col items-end justify-end">
                <span class="text-xs text-gray-400 mt-3">{{formatPast(currentDevice.loginTime)}}</span>
<!--                <span class="text-xs text-gray-400 mt-3 mb&#45;&#45;1 cursor-pointer" @click="handleTrust">-->
                  <el-switch
                    v-model="currentDevice.trusted"
                    inline-prompt
                    active-text="已开启"
                    inactive-text="未开启"
                    @change="handleTrust(currentDevice.id)"
                  />
<!--                  <Icon name="line-md:logout" />-->
<!--                </span>-->
              </div>
            </div>
          </div>

          <!-- 其他设备 -->
          <div>
            <div class="text-sm font-medium text-gray-700 mb-2">其他登录设备</div>
            <div class="space-y-3">
              <el-card v-for="(device, i) in devices" :key="i" shadow="hover" class="relative">
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <el-avatar :icon="device.icon" size="large" class="bg-gray-100 text-gray-500" />
                    <div>
                      <div class="text-sm font-medium text-gray-800">{{ device.os }}</div>
                      <div class="text-xs text-gray-500">{{ device.browser }} · {{ device.os }} · {{ device.area }}</div>
                      <div class="text-xs text-gray-400">IP: {{ device.ip }} · {{device.trusted ? '已信任' : '未信任'}}</div>
                    </div>
                  </div>
                  <div class="text-xs text-gray-400 absolute right-3 top-3 text-right">
                    <span>{{ formatPast(device.loginTime) }}</span>
                    <Icon name="ep:right" class="ml-2 cursor-pointer"/>
                  </div>
                </div>
              </el-card>
            </div>
          </div>

          <!-- 安全提示 -->
          <div class="bg-yellow-50 text-yellow-700 border border-yellow-200 p-3 text-xs rounded-md">
            <p class="mb-1">
              <Icon name="ep:warning-filled" class="inline-block mr-1" />
              <strong>安全提示</strong>
            </p>
            <ul class="list-disc ml-5 space-y-1">
              <li>如果您发现任何陌生设备，请立即退出登录并修改密码</li>
              <li>建议定期查看登录设备，确保账户安全</li>
              <li>使用完毕后，请及时退出公共设备上的账户</li>
            </ul>
          </div>
        </div>

        <!-- 底部按钮 -->
        <template #footer>
            <el-button type="danger" @click="logoutAll">退出所有其他设备</el-button>
        </template>
  </Dialog>
</template>

<style scoped></style>
