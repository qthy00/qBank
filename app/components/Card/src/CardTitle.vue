<script lang="ts" setup>
defineComponent({
  name: 'CardTitle'
})

defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <span class="card-title">{{ title }}</span>
  <slot class="float-end" name="right"></slot>
</template>

<style scoped lang="scss">
.card-title {
  font-size: 18px;
  font-weight: 600;
  align-items: center;

  &::before {
    position: relative;
    top: 20px;
    left: -5px;
    display: inline-block;
    width: 5px;
    height: 25px;
    //background-color: #105cfb;
    background: var(--el-color-primary);
    border-radius: 8px;
    content: '';
    transform: translateY(-50%);
  }
}
</style>
