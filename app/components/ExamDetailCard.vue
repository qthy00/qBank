<script setup lang="ts">

const props = defineProps({
  categoryName: {
    type: String,
    required: true
  },
  exams: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(exam => {
        return exam.id && exam.name && exam.image && exam.subjects && exam.news &&
            exam.materials && exam.questionBanks && exam.daysLeft &&
            exam.registrationItems && exam.examItems && exam.scoreItems
      })
    }
  }
})

const activeTab = ref(props.exams[0].id)

const activateTab = (tabId) => {
  activeTab.value = tabId
}
</script>

<template>
  <div class="container mx-auto px-4 my-5 bg-(--color-bg-container) ">
    <!-- 顶部导航栏 -->
    <div class="flex items-center justify-between py-4 border-b border-(--color-border) ">
      <div class="text-xl font-bold">{{ categoryName }}</div>
      <!-- Tab菜单 -->
      <div class="flex-1 flex justify-center space-x-4" id="tab-menu">
        <a
            v-for="(exam, index) in exams"
            :key="index"
            href="#"
            @click.prevent="activateTab(exam.id)"
            :class="[
            'tab-link border border-(--color-border) rounded-full bg-(--color-bg-container) text-(--color-text-secondary) px-3 py-1 hover:bg-(--color-btn-hover) hover:text-(--color-bg-container)',
            activeTab === exam.id ? 'active-tab bg-(--color-btn-primary) text-(--color-bg-container)' : ''
          ]"
        >
          {{ exam.name }}
        </a>
      </div>
      <!-- 右侧更多 -->
      <div class="flex justify-end">
        <a href="#"
           class="text-(--color-text-secondary) px-3 rounded-full flex items-center border border-(--color-border) hover:bg-(--color-disabled)">
          <span class="mr-1 ">更多</span> <i class="hy-ico-djt ic-12"></i>
        </a>
      </div>
    </div>

    <div class="relative">
      <!-- 主体内容区，分左右布局 -->
      <div
          v-for="(exam, index) in exams"
          v-show="activeTab === exam.id"
          :key="index"
          :class="[
          'flex flex-wrap gap-3 mt-3 tab-content',
          activeTab !== exam.id ? 'hidden' : ''
        ]"
      >

        <!-- 左侧内容 -->
        <div class="flex-1 md:flex-1 mb-4">
          <div class="bg-(--color-bg-container-hover) p-4  h-full flex flex-col">
            <img src="~/assets/images/a.jpg" alt="学习方案图片" class="w-full rounded mb-4">
            <div class="text-(--color-text-primary) font-black text-lg mb-3">考试科目</div>
            <div class="overflow-y-auto  rounded p-3 mb-4 max-h-60">
              <ul class="space-y-3 text-sm text-(--color-text-secondary) font-medium">
                <li v-for="(subject, subIndex) in exam.subjects" :key="subIndex">
                  <span class="font-bold">{{ String(subIndex + 1).padStart(2, '0') }}</span>
                  <span class="ml-2">{{ subject.title }}</span>
                  <div class="ml-6">{{ subject.description }}</div>
                </li>
              </ul>
            </div>
            <!-- 固定底部按钮 -->
            <div class="mt-auto">
              <a href="#" class="block bg-(--color-btn-primary) text-(--color-btn-text) px-4 py-2 hover:-translate-y-1 text-center hover:bg-(--color-btn-hover)
                  hover:text-(--color-bg-container) transition-all">
                查看详情
              </a>
            </div>
          </div>
        </div>

        <!-- 中间区域 -->
        <div class="flex-2 md:flex-2 mb-4">
          <div class="bg-(--color-bg-container-hover) p-4 h-full flex flex-col space-y-5">
            <!-- 头条部分 -->
            <a v-for="(news, newsIndex) in exam.news" :key="newsIndex" href="" class="flex items-center space-x-2">
              <div :class="[
                'text-white px-2 py-1 rounded-full text-sm',
                newsIndex === 0 ? 'bg-(--color-warning)' : 'bg-(--color-text-hover)'
              ]">
                {{ newsIndex === 0 ? '头条' : '推荐' }}
              </div>
              <div class="relative inline-block text-(--color-text-primary) hover:text-(--color-text-hover) font-medium after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
                {{ news.title }}
              </div>
            </a>

            <!-- 备考资料 -->
            <div class="border-b-1 border-(--color-border)">
              <div class="text-(--color-text-primary)  font-bold mb-3">备考资料</div>
              <div class="grid grid-cols-3 gap-3 mb-3">
                <!-- 图文块 -->
                <a v-for="(material, matIndex) in exam.materials" :key="matIndex" href="#" class="block group">
                  <div class="flex flex-col items-center text-center">
                    <div class="overflow-hidden w-full h-32 mb-2">
                      <img :src="material.image" alt=""
                           class="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110">
                    </div>
                    <div class="text-sm text-(--color-text-secondary) hover:text-(--color-text-hover) line-clamp-2 text-wrap">
                      {{ material.title }}
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <!-- 题库 -->
            <div class="mt-auto">
              <div class="text-(--color-text-primary) font-bold mb-2">{{ exam.name }}题库</div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a
                    v-for="(questionBank, bankIndex) in exam.questionBanks"
                    :key="bankIndex"
                    href="#"
                    class="bg-(--color-btn-primary) text-center py-3 text-sm text-(--color-btn-text) hover:bg-(--color-btn-hover) hover:text-(--color-bg-container) transition-all">
                  {{ questionBank }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧区域 -->
        <div class="flex-1 md:flex-1 mb-4 bg-(--color-bg-container-hover)">
          <div class="space-y-6 ">
            <div class="bg-gradient-to-br from-(--color-btn-primary)/70 to-(--color-btn-hover)/90 p-1 mb-2 shadow-md">
              <!-- 装饰元素 -->
              <div
                  class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/4 -translate-y-1/4">
              </div>
              <div class="text-(--color-bg-container) text-lg mb-3 pt-2 text-center ">距离考试剩余</div>
              <div class="flex justify-center items-center space-x-3 pb-2 text-(--color-bg-container)">
                <div class="">
                  还有
                </div>
                <div class="bg-(--color-bg-container-hover) px-5 py-2 rounded-full text-2xl font-bold text-(--color-btn-primary)">
                  {{ exam.daysLeft }}
                </div>
                <div class="">
                  天
                </div>
              </div>
            </div>

            <div class="space-y-4">

              <div class="mb-5">
                <!-- 分类标题 -->
                <div class="mb-1 pb-1 flex items-center">
                  <div class="w-1.5 h-6 bg-(--color-btn-primary) rounded-full mr-3"></div>
                  <h3 class="text-lg tracking-tight">报名</h3>
                </div>
                <div class="flex flex-wrap pl-2 gap-3">
                  <a href="#" class="px-3 py-1 rounded hover:text-(--color-btn-hover) text-(--color-text-secondary) transition-transform duration-200 group-hover:scale-110 inline-block">
                    {{ regItem }}
                  </a>
                </div>
              </div>

              <div class="mb-5">
                <!-- 分类标题 -->
                <div class="mb-1 pb-1 flex items-center">
                  <div class="w-1.5 h-6 bg-(--color-btn-primary) rounded-full mr-3"></div>
                  <h3 class="text-lg tracking-tight">考试</h3>
                </div>
                <div class="flex flex-wrap pl-2 gap-3">
                  <a href="#" class="px-3 py-1 rounded hover:text-(--color-btn-hover) text-(--color-text-secondary) transition-transform duration-200 group-hover:scale-110 inline-block">
                    {{ examItem }}
                  </a>
                </div>
              </div>

              <div class="mb-5">
                <!-- 分类标题 -->
                <div class="mb-1 pb-1 flex items-center">
                  <div class="w-1.5 h-6 bg-(--color-btn-primary) rounded-full mr-3"></div>
                  <h3 class="text-lg tracking-tight">成绩</h3>
                </div>
                <div class="flex flex-wrap pl-2 gap-3">
                  <a href="#" class="px-3 py-1 rounded hover:text-(--color-btn-hover) text-(--color-text-secondary) transition-transform duration-200 group-hover:scale-110 inline-block">
                    {{ scoreItem }}
                  </a>
                </div>
              </div>



            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>