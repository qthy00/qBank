<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const authStore = useAuthStore()
const { openModal } = useModal()
const route = useRoute()

// 监听登录状态变化，登录成功后刷新页面以加载数据
watch(() => authStore.isLogin, (isLogin) => {
  if (isLogin && route.query.needLogin) {
    // 移除 needLogin 参数并刷新
    const { needLogin, ...restQuery } = route.query
    navigateTo({
      path: route.path,
      query: restQuery
    })
  }
})
</script>

<template>
  <Suspense>
    <template #default>
      <div class="bg-gray-50">
        <Navbar />

        <!-- 未登录状态显示登录提示 -->
        <template v-if="!authStore.isLogin">
          <div class="min-h-[calc(100vh-200px)] flex items-center justify-center">
            <el-card class="w-[400px] text-center">
              <template #header>
                <h3 class="text-lg font-medium">请先登录</h3>
              </template>
              <el-empty description="登录后可查看账户信息">
                <template #default>
                  <p class="text-gray-500 mb-4">登录后可查看个人资料、学习记录等信息</p>
                  <el-button type="primary" size="large" @click="openModal('login')">
                    立即登录
                  </el-button>
                </template>
              </el-empty>
            </el-card>
          </div>
        </template>

        <!-- 已登录状态显示正常布局 -->
        <template v-else>
          <UserHeader/>
          <UserSideBar>
            <slot/>
          </UserSideBar>
        </template>

        <Footer/>
      </div>
    </template>
    <template #fallback>
      <div class="flex justify-center items-center h-screen">
        <div>页面加载中。。。</div>
      </div>
    </template>
  </Suspense>
</template>
