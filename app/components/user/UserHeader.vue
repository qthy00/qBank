<template>
  <div class="user-center bg-gray-50">
    <!-- 顶部背景与用户信息 -->
    <div class="relative w-full">
      <img
        src="../../assets/images/bg.png"
        class="w-full h-56 object-cover"
        alt="背景图"
      >
      <div class="absolute inset-0 bg-black bg-opacity-30"/>
      <!-- 用户信息 -->
      <div class="absolute bottom-4 left-0 w-full">
        <div class="container mx-auto px-4 flex items-center space-x-4 text-white">

          <el-avatar :size="64" :src="avatar" />
          <div>
            <div class="text-xl font-bold">{{ userName }}</div>
            <div class="text-sm">
              <el-tag size="small" type="primary">普通会员</el-tag>
              <span class="ml-2 text-gray-200">{{ slogan }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import avatarImg from '~/assets/images/avatar.jpg'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const avatar = ref(user.value?.avatar || avatarImg)
const userName = ref(user.value?.nickname || '新用户')
const slogan = ref(user.value?.tagline || '我是一片云~~')

</script>

<style scoped>
.user-center {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
</style>
