<!-- 语言选择器 -->
<template>
  <div class="relative ml-2">
    <ClientOnly>
    <el-dropdown @command="handleLanguageChange">
      <button
        class="flex items-center justify-center px-3 py-1.5 transition-colors duration-200 rounded"
        :class="[
          isScrolled ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-white/2 hover:bg-white/20 text-white'
        ]"
        type="button"
      >
        <i class="i-fa:language mr-1.5"/>
        <span class="text-sm">{{ currentLocaleName }}</span>
      </button>

      <template #dropdown>
        <el-dropdown-menu class="p-1 rounded-lg shadow-lg">
          <el-dropdown-item
            v-for="loc in availableLocales"
            :key="loc.code"
            :command="loc.code"
            class="px-3 py-2 rounded-md hover:bg-blue-50 flex items-center"
          >
            <i class="i-fa:language text-blue-500 mr-2"/>
            <span>{{ loc.name }}</span>
            <i v-if="loc.code === currentLocale" class="el-icon-check ml-auto text-blue-500"/>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps({
  isScrolled: {
    type: Boolean,
    default: false
  }
})

const { locale } = useI18n({ useScope: 'global' })

// 可用语言列表
const availableLocales = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' }
]

// 当前语言
const currentLocale = computed({
  get: () => locale.value,
  set: (newValue: string) => {
    locale.value = newValue
    localStorage.setItem('app-locale', newValue)
  }
})

// 当前语言名称
const currentLocaleName = computed(() => {
  return availableLocales.find(l => l.code === currentLocale.value)?.name || currentLocale.value
})

// 处理语言变更
const handleLanguageChange = (code: string) => {
  if (code !== currentLocale.value) {
    currentLocale.value = code
  }
}
</script>
