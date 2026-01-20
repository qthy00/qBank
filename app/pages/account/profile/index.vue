<script setup lang="ts">
import UserProfileForm from '~/components/user/UserProfileForm.vue'
import UserAvatar from '~/components/user/UserAvatar.vue'
import { formatDate } from '@/utils/formatTime.ts'

definePageMeta({
  layout: 'member'
})
useHead({
  title: '个人中心'
})

const userStore = useUserStore()
const {user: userInfo} = storeToRefs(userStore)

const activeTab = ref('account')
const vipLevel = ref(userInfo.value?.level?.level)

const formRef = ref()
const handleEdit = () => {
  formRef.value!.open(userInfo.value)
}

// const handleUpdate = (nickname: string) => {
//   userStore.setUserNickname(nickname)
// }

onMounted(() => {
  userStore.fetchUserDetailInfo()
})
</script>

<template>
  <el-tabs v-model="activeTab" type="card" class="bg-white ml-3" >
    <el-tab-pane label="账户信息" name="account">
      <el-card class="mt--4" shadow="never">
        <template #header>
          <div class="flex items-center justify-between">
            <CardTitle title="个人资料" />
            <el-button type="primary" plain @click="handleEdit"> 编辑信息 </el-button>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- 头像区域 -->
          <div class="flex flex-col items-center">
            <div class="relative mb-4">
              <UserAvatar :img="userInfo?.avatar" />
            </div>
            <el-tag type="success" size="small">
              {{ userInfo?.name ? '已实名认证' : '未实名认证' }}
            </el-tag>
          </div>

          <!-- 账户基本信息 -->
          <div class="md:col-span-2 space-y-4">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="用户ID">{{ userInfo?.uid }}</el-descriptions-item>
              <el-descriptions-item label="用户名">{{ userInfo?.userName || '--' }}</el-descriptions-item>
              <el-descriptions-item label="昵称">{{ userInfo?.nickname }}</el-descriptions-item>
              <el-descriptions-item label="注册时间">{{ formatDate(userInfo?.createTime) }}</el-descriptions-item>
              <el-descriptions-item label="会员等级">
                <span>{{ userInfo?.level?.name || '普通会员' }}</span>
                <el-rate v-model="vipLevel" disabled text-color="#ff9900" />
              </el-descriptions-item>
              <el-descriptions-item label="上次登录时间">{{ formatDate(userInfo?.loginDate) }}</el-descriptions-item>
              <el-descriptions-item label="上次登录IP">{{ userInfo?.loginIp || '--' }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>

        <!-- 个人资料详情 -->
        <el-card class="mb-3" shadow="never">
          <template #header>个人资料详情</template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="真实姓名">{{ userInfo?.name }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ userInfo?.sex === 1 ? '男' : '女' }}</el-descriptions-item>
            <el-descriptions-item label="出生日期">{{ formatDate(userInfo?.birthday, 'YYYY-MM-DD') }}</el-descriptions-item>
            <el-descriptions-item label="手机号码">{{ userInfo?.mobile }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ userInfo?.email }}</el-descriptions-item>
            <el-descriptions-item label="所在地区">{{ userInfo?.areaName }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 个性签名 -->
        <el-card shadow="never">
          <template #header>个性签名</template>
          <el-alert :title="userInfo?.slogan || '暂未设置'" type="info" :closable="false"/>
        </el-card>
      </el-card>

      <!-- 账户使用提示 -->
      <el-divider />
      <div class="mx-5 mb-6">
        <div class="font-bold text-gray-500 mb-2 items-center flex mb-3 text-lg">
          <Icon name="ep:info-filled" class="mr-1" />
          <div>账户信息提示</div>
        </div>
        <ul class="text-base text-neutral-500 space-y-1 ml-3">
          <li class="flex items-start mb-2">
            <span>用户名和用户ID注册后无法修改，请谨慎选择。</span>
          </li>
          <li class="flex items-start mb-2">
            <span>您可以随时修改您的头像、昵称和个人简介。</span>
          </li>
          <li class="flex items-start mb-2">
            <span>如需修改手机号码或邮箱，请前往账户安全页面操作。</span>
          </li>
        </ul>
      </div>

    </el-tab-pane>
    <!--    <el-tab-pane label="通知设置" name="notification">-->
    <!--      &lt;!&ndash; 此处可添加通知设置相关内容 &ndash;&gt;-->
    <!--    </el-tab-pane>-->
  </el-tabs>

  <UserProfileForm ref="formRef"/>

</template>

<style scoped>
.el-card {
  border: none !important;
}
:deep(.el-card__header) {
  border-bottom: none !important;
}
</style>
