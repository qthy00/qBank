<!-- 多行文本输入框 组件 -->
<template>
  <div class="relative" :class="containerClass">
    <textarea
      :value="modelValue"
      :class="[
        'w-full p-4 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-300 resize-none overflow-auto',
        borderClass,
        focusBorderClass,
        inputClass,
      ]"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      @change="$emit('change', $event.target.value)"
    ></textarea>

    <!-- 清除按钮 -->
    <button
      v-if="showClearBtn && modelValue && !disabled"
      @click="handleClear"
      class="absolute right-2 top-2 text-neu-300 hover:text-neu-500 transition-colors p-1 rounded-full hover:bg-neu-100"
      :aria-label="clearBtnAriaLabel"
    >
      <Icon name="ep:circle-close" width="16" height="16" />
    </button>

    <!-- 字符计数 -->
    <div v-if="showCounter" class="absolute bottom-3 right-3 text-xs text-neu-300">
      {{ modelValue.length }} 字符
    </div>
  </div>
</template>

<script setup>
// 组件 Props（保持不变）
const props = defineProps({
  /**
   * 输入框的绑定值（双向绑定）
   * 父组件通过 v-model 绑定，子组件内部通过 modelValue 接收
   * @type {String}
   * @default ''
   */
  modelValue: {
    type: String,
    default: '',
  },
  /**
   * 输入框的占位提示文本
   * 当输入框为空时显示的提示信息
   * @type {String}
   * @default '请输入内容...'
   */
  placeholder: {
    type: String,
    default: '请输入内容...',
  },
  /**
   * 输入框的行数（影响初始高度）
   * 控制 textarea 的 rows 属性，决定默认显示的文本行数
   * @type {Number}
   * @default 8
   */
  rows: {
    type: Number,
    default: 8,
  },
  /**
   * 是否显示清除按钮
   * 当输入框有内容时，右上角显示清除图标按钮
   * @type {Boolean}
   * @default true
   */
  showClearBtn: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否显示字符计数器
   * 在输入框右下角显示当前输入的字符数量
   * @type {Boolean}
   * @default true
   */
  showCounter: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否禁用输入框
   * 禁用状态下输入框不可编辑，样式变为灰色
   * @type {Boolean}
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 容器的自定义类名
   * 用于覆盖或扩展输入框外部容器的样式
   * @type {String}
   * @default ''
   */
  containerClass: {
    type: String,
    default: '',
  },
  /**
   * 输入框的自定义类名
   * 用于覆盖或扩展 textarea 元素本身的样式
   * @type {String}
   * @default ''
   */
  inputClass: {
    type: String,
    default: '',
  },
  /**
   * 清除按钮的无障碍标签（ARIA属性）
   * 用于屏幕阅读器识别按钮功能，提升可访问性
   * @type {String}
   * @default '清除输入内容'
   */
  clearBtnAriaLabel: {
    type: String,
    default: '清除输入内容',
  },
})

const emits = defineEmits(['update:modelValue', 'clear', 'change'])

// 计算属性（保持不变）
const borderClass = computed(() => {
  if (props.disabled) {
    return 'border-neu-300 bg-pri-50'
  }
  return 'border-neu-300'
})

const focusBorderClass = computed(() => {
  if (props.disabled) {
    return ''
  }
  return 'focus:ring-pri-400 focus:border-primary'
})

// 清除按钮事件（保持不变）
const handleClear = () => {
  console.log('clear')
  emits('update:modelValue', '') // 通知父组件更新值为 empty
  emits('clear')
}

defineExpose({
  handleClear,
})






</script>
