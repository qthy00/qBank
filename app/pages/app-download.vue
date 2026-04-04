<script setup lang="ts">
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'default'
})

useHead({
  title: '下载学次元APP - 随时随地，想学就学'
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/* APP功能特性 */
const features = [
  {
    icon: 'ep:edit',
    title: '智能刷题',
    desc: 'AI智能推荐，针对性练习',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: 'ep:document',
    title: '海量资料',
    desc: '历年真题，备考资料一键下载',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50',
  },
  {
    icon: 'ep:alarm-clock',
    title: '每日一练',
    desc: '科学规划，坚持打卡提分',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
  },
  {
    icon: 'ep:trophy',
    title: '排行榜',
    desc: '与全国考生同台竞技',
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
  },
  {
    icon: 'ep:magic-stick',
    title: '智能组卷',
    desc: '自定义试卷，模拟真实考试',
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-50',
  },
  {
    icon: 'ep:chat-dot-round',
    title: '学习社区',
    desc: '经验分享，答疑解惑',
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-50',
  },
]

/* 用户评价 */
const reviews = [
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    name: '张同学',
    role: '一级建造师考生',
    content: '用了学次元APP三个月，顺利通过了考试！题目很全，解析也很详细。',
    rating: 5,
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    name: '李同学',
    role: '二级建造师考生',
    content: '界面清爽，功能强大。最喜欢每日一练功能，帮我养成了良好的学习习惯。',
    rating: 5,
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zack',
    name: '王同学',
    role: '造价工程师考生',
    content: '资料下载很方便，历年真题都有。推荐给大家！',
    rating: 5,
  },
]

/* 统计数据 */
const stats = [
  { value: '1000+', label: '精品题库', icon: 'ep:collection' },
  { value: '500+', label: '学习资料', icon: 'ep:folder' },
  { value: '50万+', label: '下载用户', icon: 'ep:user' },
  { value: '4.9', label: '用户评分', icon: 'ep:star-filled' },
]

/* 下载方式 */
const downloadMethods = [
  {
    type: 'ios',
    name: 'App Store',
    icon: 'ep:apple',
    desc: 'iPhone/iPad',
    url: '#',
  },
  {
    type: 'android',
    name: 'Android',
    icon: 'ep:android',
    desc: '安卓手机/平板',
    url: '#',
  },
]

/* 显示二维码弹窗 */
const showQRCode = ref(false)
const currentDownload = ref('')

const openDownload = (type: string) => {
  currentDownload.value = type
  showQRCode.value = true
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
    <!-- 头部英雄区 - 蓝色渐变 -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500"/>
      <!-- 装饰图案 -->
      <div class="absolute inset-0">
        <div class="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"/>
        <div class="absolute bottom-20 left-20 w-48 h-48 bg-cyan-300/20 rounded-full blur-2xl"/>
        <div class="absolute top-1/3 left-1/3 w-32 h-32 bg-blue-300/20 rounded-full blur-xl"/>
        <!-- 手机mockup装饰 -->
        <div class="absolute right-10 lg:right-20 top-1/2 -translate-y-1/2 hidden lg:block">
          <div class="relative">
            <div class="w-72 h-[500px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-[3rem] border-8 border-slate-700 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
              <div class="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 rounded-[2.5rem] overflow-hidden relative">
                <!-- 屏幕内容模拟 -->
                <div class="p-6">
                  <div class="flex items-center justify-between mb-6">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500"/>
                    <div class="w-8 h-8 rounded-full bg-slate-200"/>
                  </div>
                  <div class="space-y-3">
                    <div class="h-4 bg-slate-200 rounded w-3/4"/>
                    <div class="h-4 bg-slate-200 rounded w-1/2"/>
                  </div>
                  <div class="mt-6 grid grid-cols-2 gap-3">
                    <div class="h-20 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-xl"/>
                    <div class="h-20 bg-gradient-to-br from-cyan-200 to-teal-200 rounded-xl"/>
                    <div class="h-20 bg-gradient-to-br from-teal-200 to-emerald-200 rounded-xl"/>
                    <div class="h-20 bg-gradient-to-br from-emerald-200 to-green-200 rounded-xl"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 内容 -->
      <div class="relative container mx-auto px-4 py-16 lg:py-24">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Icon name="ep:mobile-phone" class="text-white text-lg"/>
            <span class="text-white/90 text-sm font-medium">iOS & Android 双平台支持</span>
          </div>
          <h1 class="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            下载学次元APP<br/>
            <span class="text-cyan-200">随时随地，想学就学</span>
          </h1>
          <p class="text-white/90 text-lg mb-8 max-w-lg">
            海量题库、精品资料、智能练习，一部手机搞定所有备考需求。让学习更高效，让备考更轻松。
          </p>
          <!-- 下载按钮组 -->
          <div class="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              v-for="method in downloadMethods"
              :key="method.type"
              class="flex items-center gap-3 px-6 py-4 bg-white rounded-xl hover:bg-white/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              @click="openDownload(method.type)"
            >
              <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Icon :name="method.icon" class="text-2xl text-white"/>
              </div>
              <div class="text-left">
                <div class="text-xs text-slate-500">{{ method.desc }}</div>
                <div class="text-lg font-bold text-slate-800">{{ method.name }}下载</div>
              </div>
            </button>
          </div>
          <!-- 扫码提示 -->
          <div class="flex items-center gap-4 text-white/80">
            <div class="flex -space-x-2">
              <div v-for="i in 4" :key="i" class="w-10 h-10 rounded-full border-2 border-white/30 bg-gradient-to-br from-violet-400 to-pink-400"/>
            </div>
            <span class="text-sm">已有 <strong class="text-white">50万+</strong> 用户下载使用</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计数据 -->
    <div class="container mx-auto px-4 -mt-8 relative z-10">
      <div class="bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 lg:p-8 border border-blue-100">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <Icon :name="stat.icon" class="text-2xl text-blue-600"/>
            </div>
            <div class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {{ stat.value }}
            </div>
            <div class="text-slate-500 text-sm mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能特性 -->
    <div class="container mx-auto px-4 py-16 lg:py-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
          强大功能，助你<span class="text-blue-600">轻松备考</span>
        </h2>
        <p class="text-slate-500 text-lg max-w-2xl mx-auto">
          学次元APP汇集了海量题库、精品资料、智能练习等功能，全方位满足你的备考需求
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="group bg-white rounded-2xl p-6 shadow-lg shadow-slate-100/50 border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
        >
          <div class="flex items-start gap-4">
            <div :class="`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`">
              <Icon :name="feature.icon" class="text-2xl text-white"/>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-slate-800 mb-2">{{ feature.title }}</h3>
              <p class="text-slate-500 text-sm leading-relaxed">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户评价 -->
    <div class="bg-white py-16 lg:py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            用户<span class="text-blue-600">真实评价</span>
          </h2>
          <p class="text-slate-500 text-lg">听听他们怎么说</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="review in reviews"
            :key="review.name"
            class="bg-gradient-to-br from-slate-50 to-violet-50/30 rounded-2xl p-6 border border-slate-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300"
          >
            <div class="flex items-center gap-3 mb-4">
              <img :src="review.avatar" :alt="review.name" class="w-12 h-12 rounded-full bg-white shadow-sm"/>
              <div>
                <div class="font-bold text-slate-800">{{ review.name }}</div>
                <div class="text-xs text-slate-500">{{ review.role }}</div>
              </div>
            </div>
            <div class="flex gap-1 mb-3">
              <Icon v-for="i in review.rating" :key="i" name="ep:star-filled" class="text-amber-400 text-sm"/>
            </div>
            <p class="text-slate-600 text-sm leading-relaxed">{{ review.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA区域 -->
    <div class="relative overflow-hidden py-16 lg:py-20">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500"/>
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 left-0 w-full h-full" style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px); background-size: 30px 30px;"/>
      </div>
      <div class="relative container mx-auto px-4 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
          准备好开始你的备考之旅了吗？
        </h2>
        <p class="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          立即下载学次元APP，开启高效学习新模式
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            v-for="method in downloadMethods"
            :key="method.type"
            class="flex items-center justify-center gap-3 px-8 py-4 bg-white rounded-xl hover:bg-white/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            @click="openDownload(method.type)"
          >
            <Icon :name="method.icon" class="text-2xl text-blue-600"/>
            <span class="font-bold text-slate-800">{{ method.name }}下载</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 二维码弹窗 -->
    <el-dialog
      v-model="showQRCode"
      title="扫码下载"
      width="360px"
      center
      class="qr-dialog"
    >
      <div class="text-center py-4">
        <div class="w-48 h-48 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
          <Icon name="ep:full-screen" class="text-6xl text-blue-300"/>
        </div>
        <p class="text-slate-500 text-sm">请使用{{ currentDownload === 'ios' ? '微信或浏览器' : '浏览器' }}扫描二维码下载</p>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 弹窗样式覆盖 */
:deep(.qr-dialog .el-dialog__header) {
  margin-right: 0;
  padding-bottom: 10px;
}

:deep(.qr-dialog .el-dialog__title) {
  font-weight: bold;
  color: #1f2937;
}
</style>
