<script setup lang="ts">

import { copyToClipboard } from '@/utils'
import { computed } from 'vue'


const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  clearable: {
    type: Boolean,
    default: false
  },
  validation: {
    type: String,
    default: ''
  }
})

const attrs = useAttrs()
const mergedProps = computed(() => ({
  ...props,
  ...attrs
}))

const modelValue = computed({
  get: () => props.value,
  set: (val: string) => emit('update:value', val),
})

const emit = defineEmits(['update:value']);
</script>

<template>
  <div class="flex items-center flex-1">

    <div v-if="label" class="mr-2">{{ label }} </div>
    <el-input
      v-bind="mergedProps"
      v-model="modelValue"
      :placeholder="placeholder"
      :clearable="clearable"
    >
      <template #suffix>
        <el-tooltip content="复制到剪贴板">
          <el-button link size="small" @click="copyToClipboard(value)">
            <Icon name="ep:document-copy" />
          </el-button>
        </el-tooltip>
      </template>
    </el-input>
  </div>

</template>

<style scoped>

</style>
