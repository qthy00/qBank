<script setup lang="ts">
import {useAppStore} from '~/stores/app.ts'
import {downloadFile} from '@/utils'

const appStore = useAppStore()
const dialogVisible = ref(false)
const dialogRef = ref<HTMLElement | null>(null)
const options = reactive({
  width: 350,
  height: 530,
  shareInfo: appStore.platform.share.forwardInfo,
})

const isClient = typeof window !== 'undefined'

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
}

const { posterCanvas, posterImage } = useCanvas(options)


defineExpose({open})

const onSavePoster = () => {
  downloadFile({
    url: poster.src,
    filename: '海报.png',
    mimeType: 'image/png',
  })
}

</script>

<template>
  <Dialog title="分享海报" v-model="dialogVisible" width="400px" :scroll="false">
    <template #default>
      <div ref="dialogRef" class="flex flex-col items-center justify-center">
        <div
            v-if="posterImage === ''"
            class="text-#999 flex justify-center"
            :style="{
          height: poster.height + 'px',
          width: poster.width + 'px',
        }"
        >
          海报加载中...
        </div>
        <el-image
            v-else
            class="rounded-2xl"
            :src="posterImage"
            :style="{
          height: poster.height + 'px',
          width: poster.width + 'px',
        }"
            :show-menu-by-longpress="true"
        />
        <ClientOnly>
        <canvas
            v-if="isClient"
            class="hideCanvas"
            ref="posterCanvas"
            :style="{
          height: poster.height + 'px',
          width: poster.width + 'px',
        }"
        />
        </ClientOnly>
        <div class="poster-btn-box mt-3 flex justify-between items-center" v-if="posterImage !== ''">
          <el-button type="info" plain class="cancel-btn" @click="dialogVisible = false"
          >取消
          </el-button
          >
          <el-button type="primary" plain class="save-btn" @click="onSavePoster">
            保存海报
          </el-button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.hideCanvas {
  display: none;
  position: fixed;
  top: -99999rpx;
  left: -99999rpx;
  z-index: -99999;
}
</style>
