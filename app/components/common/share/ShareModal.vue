<script setup lang="ts">
import CanvasPoster from '@/components/common/share/canvas-poster/index.vue'
import { type ForwardInfo, useAppStore } from '~/stores/app.ts'
import { useModalStore } from '~/stores/modal.ts'
import { copyToClipboard } from '@/utils'



const modalStore = useModalStore()
const appStore = useAppStore()
const { closeShareModal, showAuthModal } = useModalFunction()
const shareInfo = computed(() => appStore.platform.share.forwardInfo as ForwardInfo)
const shareConfig = computed(() => appStore.platform.share)

const show = computed({
  get: () => modalStore.share,
  set: (val) => {
    modalStore.share = val
  },
})
const state = reactive({
  showShareGuide: false, // H5 的指引
  showPosterModal: false, // 海报弹窗
})

// 操作 ②：生成海报分享
const sharePosterRef = ref()
const onShareByPoster = async () => {
  closeShareModal()
  if(showAuthModal()) return
  sharePosterRef.value!.open()
}
// 操作 ①：直接转发分享
const onShareByCopyLink = () => {
  copyToClipboard(shareInfo.value.link)
  closeShareModal()
}
</script>

<template>
  <Dialog v-model="state.showShareGuide" title="分享" width="400px" :scroll="false">
    <div>1111</div>
  </Dialog>

  <Dialog v-model="show" title="分享" width="400px" :scroll="false">
    <!-- 分享 tools -->

    <div class="flex justify-evenly">
      <!-- 操作 ②：生成海报图片 -->
      <button
        v-if="shareConfig.methods.includes('poster')"
        class="share-btn"
        @click="onShareByPoster"
      >
        <div class="flex-1 flex-col items-center">
          <img class="share-img mb-2" src="~/assets/images/share_poster.png" alt="分享海报" />
          <el-text class="text-#666 mt-1">生成海报</el-text>
        </div>
      </button>
      <!-- 操作 ③：生成链接 -->
      <button
        v-if="shareConfig.methods.includes('link')"
        class="share-btn"
        @click="onShareByCopyLink"
      >
        <div class="flex-1 flex-col items-center">
          <img class="share-img mb-2" src="~/assets/images/share_link.png" alt="分享链接" />
          <el-text class="text-#666 mt-1">复制链接</el-text>
        </div>
      </button>
    </div>
  </Dialog>

  <!-- 分享海报，对应操作 ② -->
  <CanvasPoster
    ref="sharePosterRef"
    :shareInfo="shareInfo"
  />
</template>

<style scoped>
.share-btn {
  background: none;
  border: none;
  line-height: 1;
  padding: 0;

  &::after {
    border: none;
  }
}

.share-img {
  width: 60px;
  height: 60px;
  background: #f8f9fa;
  border-radius: 50%;
  margin-bottom: 20rpx;
}
</style>
