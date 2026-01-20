<script setup lang="ts">

const store = usePayDialogStore()
const { visible, title, url } = storeToRefs(store)

</script>

<template>
  <Dialog
    title="请扫码支付"
    v-model="visible"
    width="350px"
    max-height="350px"
  >
    <div class="flex flex-col items-center">
      <span class="text-lg font-bold">{{ title }}</span>
    </div>
    <Qrcode :text="url" :width="310" />
  </Dialog>
</template>

<style scoped>

</style>
