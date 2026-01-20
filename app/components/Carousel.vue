<template>
  <ClientOnly>
    <!-- nuxt-swiper 提供的 Swiper 组件（无需手动导入） -->
    <swiper-container
        ref="containerRef"
        class="w-full h-full"
        :autoplay-options="autoplayOptions"
        effect="slide"
        :loop="loop"
    >
    <!-- SwiperSlide 组件 -->
      <swiper-slide v-for="(item, index) in slides" :key="index">
        <!-- 轮播图片 -->
        <img
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover"
        >
        <!-- 可选：文字叠加层 -->
      <div v-if="item.title || item.desc " class="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
        <h3 v-if="item.title" class="text-xl font-bold">{{ item.title }}</h3>
        <p v-if="item.desc" class="text-sm">{{ item.desc }}</p>
      </div>
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<script setup lang="ts">
// 无需手动导入 Swiper/SwiperSlide，nuxt-swiper 已全局注册
// 定义 props 让组件更灵活
defineProps({
  // 轮播数据
  slides: {
    type: Array as () => Array<{ image: string; title: string; desc: string }>,
    required: true
  },
  // 自动播放配置
  autoplayOptions: {
    type: Object,
    default: () => ({ delay: 3000, disableOnInteraction: true })
  },
  // 是否循环播放
  loop: {
    type: Boolean,
    default: true
  }
})

const containerRef = ref(null)
const swiper = useSwiper(containerRef,  {
  navigation: true,
  pagination: {
    clickable: true
  },
  creativeEffect: {
    prev: {
      shadow: true,
      translate: [0, 0, -400],
    },
    next: {
      shadow: true,
      translate: [0, 0, -400],
    },
  },
})
onMounted(() => {
  console.log(swiper.instance)
})
</script>
