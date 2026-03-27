<template>
  <div>
    <template v-if="editable">
      <component :is="component" v-model="innerValue" v-bind="mergedProps">
        <slot/>
      </component>
    </template>
    <template v-else>
      <el-text class="font-bold">{{ displayValue }}</el-text>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object, Date],
    default: undefined
  },
  editable: Boolean,
  component: {
    type: String,
    default: 'el-input' // 支持 el-input、el-select、el-date-picker 等
  },
  props: {
    type: Object,
    default: () => ({})
  },
  formatter: {
    type: Function,
    default: undefined
  } // 可选：自定义展示格式函数
})
const emit = defineEmits(['update:modelValue'])
const innerValue = ref(props.modelValue)

watch(() => props.modelValue, val => {
  innerValue.value = val
})

watch(innerValue, val => {
  emit('update:modelValue', val)
})

// 收集传给 component 的额外属性（事件等）
const attrs = useAttrs()

// const componentProps = computed(() => props.props)
const mergedProps = computed(() => ({
  ...props.props,
  ...attrs
}))


const displayValue = computed(() => {
  if (typeof props.formatter === 'function') {
    return props.formatter(props.modelValue)
  }
  return props.modelValue ?? '-'
})
</script>
