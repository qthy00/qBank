<template>
  <div v-show="showBox" :class="mode === 'pop' ? 'mask' : ''">
    <div
      :class="mode === 'pop' ? 'verifybox' : ''"
      :style="{ 'max-width': parseInt(imgSize.width) + 20 + 'px' }"
    >
      <div v-if="mode === 'pop'" class="verifybox-top">
        {{ t('captcha.verification') }}
        <span class="verifybox-close" @click="closeBox">
          <i class="iconfont icon-close"/>
        </span>
      </div>
      <div :style="{ padding: mode === 'pop' ? '10px' : '0' }" class="verifybox-bottom">
        <!-- 验证码容器 -->
        <component
          :is="componentType"
          v-if="componentType"
          ref="instance"
          :arith="arith"
          :bar-size="barSize"
          :block-size="blockSize"
          :captcha-type="captchaType"
          :explain="explain"
          :figure="figure"
          :img-size="imgSize"
          :mode="mode"
          :type="verifyType"
          :v-space="vSpace"
        />
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
/**
 * Verify 验证码组件
 * @description 分发验证码使用
 * */
import VerifyPoints from './components/VerifyPoints.vue'
import VerifySlide  from './components/VerifySlide.vue'
import { computed, ref, toRefs, watchEffect } from 'vue'

export default {
  name: 'Vue3Verify',
  components: {
    VerifySlide,
    VerifyPoints
  },
  props: {
    captchaType: {
      type: String,
      required: true
    },
    figure: {
      type: Number,
      default: undefined
    },
    arith: {
      type: Number,
      default: undefined
    },
    mode: {
      type: String,
      default: 'pop'
    },
    vSpace: {
      type: Number,
      default: undefined
    },
    explain: {
      type: String,
      default: undefined
    },
    imgSize: {
      type: Object,
      default() {
        return {
          width: '310px',
          height: '155px'
        }
      }
    },
    blockSize: {
      type: Object,
      default: undefined
    },
    barSize: {
      type: Object,
      default: undefined
    }
  },
  setup(props) {
    const { t } = useI18n()
    const { captchaType, mode } = toRefs(props)
    const clickShow = ref(false)
    const verifyType = ref(undefined)
    const componentType = ref(undefined)

    const instance = ref({})

    const showBox = computed(() => {
      if (mode.value === 'pop') {
        return clickShow.value
      } else {
        return true
      }
    })
    /**
     * refresh
     * @description 刷新
     * */
    const refresh = () => {
      if (instance.value.refresh) {
        instance.value.refresh()
      }
    }
    const closeBox = () => {
      clickShow.value = false
      refresh()
    }
    const show = () => {
      if (mode.value === 'pop') {
        clickShow.value = true
      }
    }
    watchEffect(() => {
      switch (captchaType.value) {
        case 'blockPuzzle':
          verifyType.value = '2'
          componentType.value = 'VerifySlide'
          break
        case 'clickWord':
          verifyType.value = ''
          componentType.value = 'VerifyPoints'
          break
      }
    })

    return {
      t,
      clickShow,
      verifyType,
      componentType,
      instance,
      showBox,
      closeBox,
      show
    }
  }
}
</script>
<style>
.verifybox {
  position: relative;
  top: 50%;
  left: 50%;
  background-color: #fff;
  border: 1px solid #e4e7eb;
  border-radius: 5px;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgb(0 0 0 / 30%);
  box-sizing: border-box;
}

.verifybox-top {
  height: 40px;
  padding: 0 15px;
  font-size: 16px;
  line-height: 40px;
  color: #45494c;
  text-align: left;
  border-bottom: 1px solid #e4e7eb;
  box-sizing: border-box;
}

.verifybox-bottom {
  padding: 10px;
  box-sizing: border-box;
}

.verifybox-close {
  position: absolute;
  top: 13px;
  right: 9px;
  width: 24px;
  height: 24px;
  text-align: center;
  cursor: pointer;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  width: 100%;
  height: 100vh;
  background: rgb(0 0 0 / 30%);

  /* display: none; */
  transition: all 0.5s;
}

.verify-tips {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  color: #fff;
  text-indent: 10px;
}

.suc-bg {
  background-color: rgb(92 184 92 / 50%);
  filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f5CB85C, endcolorstr=#7f5CB85C);
}

.err-bg {
  background-color: rgb(217 83 79 / 50%);
  filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7fD9534F, endcolorstr=#7fD9534F);
}

.tips-enter,
.tips-leave-to {
  bottom: -30px;
}

.tips-enter-active,
.tips-leave-active {
  transition: bottom 0.5s;
}

/* ---------------------------- */

/* 常规验证码 */
.verify-code {
  margin-bottom: 5px;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #ddd;
}

.cerify-code-panel {
  height: 100%;
  overflow: hidden;
}

.verify-code-area {
  float: left;
}

.verify-input-area {
  float: left;
  width: 60%;
  padding-right: 10px;
}

.verify-change-area {
  float: left;
  line-height: 30px;
}

.varify-input-code {
  display: inline-block;
  width: 100%;
  height: 25px;
}

.verify-change-code {
  color: #337ab7;
  cursor: pointer;
}

.verify-btn {
  width: 200px;
  height: 30px;
  margin-top: 10px;
  color: #fff;
  background-color: #337ab7;
  border: none;
  border-radius: 8px;
}

/* 滑动验证码 */
.verify-bar-area {
  position: relative;
  text-align: center;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: content-box;
}

.verify-bar-area .verify-move-block {
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 2px #888;
  box-sizing: content-box;
}

.verify-bar-area .verify-move-block:hover {
  color: #fff;
  background-color: #337ab7;
}

.verify-bar-area .verify-left-bar {
  position: absolute;
  top: -1px;
  left: -1px;
  cursor: pointer;
  background: #f0fff0;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: content-box;
}

.verify-img-panel {
  position: relative;
  margin: 0;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-radius: 3px;
  box-sizing: content-box;
}

.verify-img-panel .verify-refresh {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  width: 25px;
  height: 25px;
  padding: 5px;
  text-align: center;
  cursor: pointer;
}

.verify-img-panel .icon-refresh {
  font-size: 20px;
  color: #fff;
}

.verify-img-panel .verify-gap {
  position: relative;
  z-index: 2;
  background-color: #fff;
  border: 1px solid #fff;
}

.verify-bar-area .verify-move-block .verify-sub-block {
  position: absolute;
  z-index: 3;
  text-align: center;

  /* border: 1px solid #fff; */
}

.verify-bar-area .verify-move-block .verify-icon {
  font-size: 18px;
}

.verify-bar-area .verify-msg {
  z-index: 3;
}

/* 字体图标的css */

/* @font-face {font-family: "iconfont"; */

/* src: url('../fonts/iconfont.eot?t=1508229193188'); !* IE9*! */

/* src: url('../fonts/iconfont.eot?t=1508229193188#iefix') format('embedded-opentype'), !* IE6-IE8 *! */

/* url('data:application/x-font-woff;charset=utf-8;base64,d09GRgABAAAAAAaAAAsAAAAACUwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADMAAABCsP6z7U9TLzIAAAE8AAAARAAAAFZW7kiSY21hcAAAAYAAAAB3AAABuM+qBlRnbHlmAAAB+AAAAnQAAALYnrUwT2hlYWQAAARsAAAALwAAADYPNwajaGhlYQAABJwAAAAcAAAAJAfeA4dobXR4AAAEuAAAABMAAAAYF+kAAGxvY2EAAATMAAAADgAAAA4CvAGsbWF4cAAABNwAAAAfAAAAIAEVAF1uYW1lAAAE/AAAAUUAAAJtPlT+fXBvc3QAAAZEAAAAPAAAAE3oPPXPeJxjYGRgYOBikGPQYWB0cfMJYeBgYGGAAJAMY05meiJQDMoDyrGAaQ4gZoOIAgCKIwNPAHicY2Bk/sM4gYGVgYOpk+kMAwNDP4RmfM1gxMjBwMDEwMrMgBUEpLmmMDgwVDxbwtzwv4EhhrmBoQEozAiSAwAw1A0UeJzFkcENgCAMRX8RjCGO4gTe9eQcnhzAfXC2rqG/hYsT8MmD9gdS0gJIAAaykAjIBYHppCvuD8juR6zMJ67A89Zdn/f1aNPikUn8RvYo8G20CjKim6Rf6b9m34+WWd/vBr+oW8V6q3vF5qKlYrPRp4L0Ad5nGL8AeJxFUc9rE0EYnTezu8lMsrvtbrqb3TRt0u6mbdOmdI0JbWmCtiItIv5oi14qevCk9SQVLFiQgqAF8Q9QLKIHLx48FkHo3ZNnFUXwD5C2B6dO6sFhmI83w7z3fe8RnZCjb2yX5YlLhskkmScXCIFRxYBFiyjH9Rqtoqes9/g5i8WVuJyqDNTYLPwBI+cljXrkGynDhoU+nCgnjbhGY5yst+gMEq8IBIXwsjPU67CnEPm4b0su0h309Fd67da4XBhr55KSm17POk7gOE/Shq6nKdVsC7d9j+tcGPKVboc9u/0jtB/ZIA7PXTVLBef6o/paccjnwOYm3ELJetPuDrvV3gg91wlSXWY6H5qVwRzWf2TybrYYfSdqoXOwh/Qa8RWIjBTiSI3h614/vKSNRhONOrsnQi6Xf4nQFQDTmJE1NKbhI6crHEJO/+S5QPxhYJRRyvBFBP+5T9EPpEAIVzzRQIrjmJ6jY1WTo+NXTMchuBsKuS8PRZATSMl9oTA4uNLkeIA0V1UeqOoGQh7IAxGo+7T83fn3T+voqCNPPAUazUYUI7LgKSV1Jk2oUeghYGhZ+cKOe2FjVu5ZKEY2VkE13AK1+jI4r1KLbPlZfrKiPhOXKPRj7q9sj9XJ7LFHNmrKJS3VCdhXGSdKrtmoQaWeMjQVt0KD6sGPOx0oH2fgtzoNROxtNq8F3tzYM/n+TjKSX5qf2jx941276TIr9FjXxKr8eX/6bK4yuopwo9py1sw8F9kdw4AmurRpLUM3tYx5ZnKpfHPi8dzz19vJ6MjyxYUrpqeb1uLs3eGV6vr21pSqpeWkqonAN9oUyIiXpv8XvlN5e3icY2BkYGAA4n0vN4fG89t8ZeBmYQCBa9wPPRH0/wcsDMwmQC4HAxNIFABAfAqaAHicY2BkYGBu+N/AEMPCAAJAkpEBFbABAEcMAm94nGNhYGBgfsnAwMKAigESnwEBAAAAAAAAdgCkANoBCAFsAAB4nGNgZGBgYGMIZGBlAAEmIOYCQgaG/2A+AwARSAFzAHicZY9NTsMwEIVf+gekEqqoYIfkBWIBKP0Rq25YVGr3XXTfpk6bKokjx63UA3AejsAJOALcgDvwSCebNpbH37x5Y08A3OAHHo7fLfeRPVwyO3INF7gXrlN/EG6QX4SbaONVuEX9TdjHM6bCbXRheYPXuGL2hHdhDx18CNdwjU/hOvUv4Qb5W7iJO/wKt9Dx6sI+5l5XuI1HL/bHVi+cXqnlQcWhySKTOb+CmV7vkoWt0uqca1vEJlODoF9JU51pW91T7NdD5yIVWZOqCas6SYzKrdnq0AUb5/JRrxeJHoQm5Vhj/rbGAo5xBYUlDowxQhhkiMro6DtVZvSvsUPCXntWPc3ndFsU1P9zhQEC9M9cU7qy0nk6T4E9XxtSdXQrbsuelDSRXs1JErJCXta2VELqATZlV44RelzRiT8oZ0j/AAlabsgAAAB4nGNgYoAALgbsgI2RiZGZkYWRlZGNkZ2BsYI1OSM1OZs1OSe/OJW1KDM9o4S9KDWtKLU4g4EBAJ79CeQ=') format('woff'), */

/* url('../fonts/iconfont.ttf?t=1508229193188') format('truetype'), !* chrome, firefox, opera, Safari, Android, iOS 4.2+*! */

/* url('../fonts/iconfont.svg?t=1508229193188#iconfont') format('svg'); !* iOS 4.1- *! */

/* } */

.iconfont {
  font-family: iconfont !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

/* 使用CSS Unicode字符替代Base64图片 - 优化后的图标样式 */
.icon-check::before {
  position: absolute;
  z-index: 9999;
  display: block;
  width: 16px;
  height: 16px;
  margin: auto;
  color: #67c23a;
  font-size: 16px;
  font-weight: bold;
  line-height: 16px;
  text-align: center;
  content: '\2713';
  inset: 0;
}

.icon-close::before {
  position: absolute;
  z-index: 9999;
  display: block;
  width: 16px;
  height: 16px;
  margin: auto;
  color: #f56c6c;
  font-size: 16px;
  font-weight: bold;
  line-height: 16px;
  text-align: center;
  content: '\2715';
  inset: 0;
}

.icon-right::before {
  position: absolute;
  z-index: 9999;
  display: block;
  width: 16px;
  height: 16px;
  margin: auto;
  color: #409eff;
  font-size: 16px;
  font-weight: bold;
  line-height: 16px;
  text-align: center;
  content: '\2192';
  inset: 0;
}

.icon-refresh::before {
  position: absolute;
  z-index: 9999;
  display: block;
  width: 16px;
  height: 16px;
  margin: auto;
  color: #909399;
  font-size: 14px;
  font-weight: bold;
  line-height: 16px;
  text-align: center;
  content: '\21bb';
  inset: 0;
}
</style>
