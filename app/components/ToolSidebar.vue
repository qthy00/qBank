<template>
  <!-- 工具侧边栏占位组件 -->
  <aside v-if="visible" class="hidden lg:block lg:col-span-1">
    <div class="bg-white rounded-lg shadow p-4 sticky top-4">
      <h3 class="font-semibold text-gray-800 mb-4">工具菜单</h3>
      <nav class="space-y-2">
        <a href="#" class="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">
          菜单项 1
        </a>
        <a href="#" class="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">
          菜单项 2
        </a>
        <a href="#" class="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">
          菜单项 3
        </a>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface Props {
  visible?: boolean
}

withDefaults(defineProps<Props>(), {
  visible: false
})
</script>
