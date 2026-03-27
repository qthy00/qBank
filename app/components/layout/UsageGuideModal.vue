<!-- 使用说明弹窗 -->
  <template>
    <Dialog v-model="dialogVisible" title="使用说明" >
      <div class="mt-3 mb-10" v-html="content"/>
    </Dialog>
  </template>


<script setup lang="ts">
const dialogVisible = ref(false)
const content = ref('')
/** 打开弹窗 */
const open = async (html: string) => {
  if(html && html.trim()){
    content.value = html
  }
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

</script>

<style scoped>

</style>
