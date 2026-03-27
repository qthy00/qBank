<template>
  <button
    class="group relative block bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    @click="handleClick"
  >
    <!-- 顶部装饰条 -->
    <div class="absolute h-1.5 w-full rounded-t-lg top-0" :class="`bg-${color}-500`"/>

    <!-- 自定义标签（按需显示） -->
    <div v-if="badgeText" class="absolute top-3 right-3 z-10">
      <div
        class="text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm"
        :class="badgeColor ? `bg-${badgeColor}-500` : `bg-${color}-500`"
      >
        {{ badgeText }}
      </div>
    </div>

    <div class="p-5">
      <!-- 图标和名称区域 -->
      <div class="flex items-center mb-4">
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 transition-colors"
          :class="`bg-${color}-50 group-hover:bg-${color}-100`"
        >
          <Icon
            :name="icon"
            :size="22"
            :class="`text-${color}-600`"
          />
        </div>
        <div>
          <h3
            class="text-base font-semibold text-gray-800 transition-colors"
            :class="`group-hover:text-${color}-700`"
          >
            {{ title }}
          </h3>
          <p class="text-xs text-gray-500">{{ subtitle }}</p>
        </div>
      </div>

      <!-- 描述文本 -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ description }}
      </p>

      <!-- 详情按钮 -->
      <div class="flex justify-end items-center text-sm font-medium" :class="`text-${color}-600`">
        <span>{{ actionText }}</span>
        <Icon
          name="material-symbols:arrow-right"
          width="16"
          height="16"
          class="ml-2 transition-transform duration-300 group-hover:translate-x-1"
        />
      </div>
    </div>

    <!-- 底部装饰条 -->
    <div class="absolute h-1.5 w-full bottom-0" :class="`bg-${color}-100`"/>
  </button>
</template>

<script setup lang="ts">
interface Props {
  /* 主色调前缀（indigo/emerald/amber等） */
  color: string
  /* 图标名称（material-symbols:xxx） */
  icon: string
  /* 主标题 */
  title: string
  /* 副标题 */
  subtitle: string
  /* 描述文本 */
  description: string
  /* 操作按钮文本 */
  actionText?: string
  /* 标签文本（有值则显示标签） */
  badgeText?: string
  /* 标签颜色（默认使用主色调） */
  badgeColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  actionText: '查看详情',
  badgeText: '',
  badgeColor: ''
})

// 点击事件回调
const emit = defineEmits(['click'])
const handleClick = () => {
  emit('click')
}
</script>
