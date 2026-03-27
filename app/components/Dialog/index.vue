<script lang="ts" setup>
import {propTypes} from '~/utils/propTypes'
import {isNumber} from '~/utils/is'

defineOptions({name: 'AppDialog'})

const appStore = useAppStore()
const {isMobile} = storeToRefs(appStore)

const slots = useSlots()

const props = defineProps({
  modelValue: propTypes.bool.def(false),
  title: propTypes.string.def('Dialog'),
  fullscreen: propTypes.bool.def(true),
  width: propTypes.oneOfType([String, Number]).def('60%'),
  scroll: propTypes.bool.def(true), // 是否开启滚动条。如果是的话，按照 maxHeight 设置最大高度
  maxHeight: propTypes.oneOfType([String, Number]).def('800px')
})
const dialogHeight = ref(isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight)
const isFullscreen = ref(false)
const width = ref(props.width)

watch(isMobile, (val) => {
  if (val) {
    width.value = '90%'
    dialogHeight.value = '60vh'
  } else {
    width.value = props.width
  }
})

watch(
    () => isFullscreen.value,
    async (val: boolean) => {
      await nextTick()
      if (val) {
        const windowHeight = document.documentElement.offsetHeight
        dialogHeight.value = `${windowHeight - 55 - 60 - (slots.footer ? 63 : 0)}px`
      } else {
        dialogHeight.value = isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight
      }
    },
    {
      immediate: true
    }
)

const getBindValue = computed(() => {
  const delArr: string[] = ['fullscreen', 'title', 'maxHeight', 'appendToBody']
  const attrs = useAttrs()
  const obj = {...attrs, ...props}
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete obj[key]
    }
  }
  return obj
})

const dialogStyle = computed(() => {
  return {
    height: unref(dialogHeight)
  }
})
</script>

<template>
    <el-dialog
        :z-index="2002"
        v-bind="getBindValue"
        :close-on-click-modal="true"
        :fullscreen="isFullscreen"
        :width="width"
        destroy-on-close
        lock-scroll
        draggable
        class="!rounded-2xl shadow-lg backdrop-blur-md !p-0 com-dialog"
        :show-close="false"
        align-center
    >
      <template #header="{ close }">
        <div
:class="`rounded-tr-2xl rounded-tl-2xl ${isMobile ? 'p-2' : 'p-4'} border-b border-gray-100 flex justify-between
      items-center bg-gradient-to-r from-blue-600 to-blue-300 shadow-md`">
          <div class="text-white">
            <h3 class="ml-1 text-lg font-bold flex items-center relative pl-6 text-white/95">
              <!-- 左侧装饰条 -->
              <span class="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-6 bg-white rounded-full"/>
              <slot name="title">
                {{ title }}
              </slot>
            </h3>
          </div>
          <el-button
              circle
              class="transition-all p-2 rounded-full cursor-pointer hover:bg-white/20 text-blue hover:text-white z-20"
              @click="close"
          >
            <Icon name="ep:close"/>
          </el-button>
        </div>
      </template>
      <div class="mx-5 mb-5">
        <el-scrollbar v-if="scroll" :style="dialogStyle">
          <slot/>
        </el-scrollbar>
        <slot v-else/>
      </div>
      <template v-if="slots.footer" #footer>
        <slot name="footer"/>
      </template>
    </el-dialog>
</template>

<style lang="scss">
.com-dialog {

  .#{$elNamespace}-dialog {
    &__footer {
      border-top: 1px solid var(--el-border-color);
      margin-bottom: 13px;
      margin-right: 20px;
    }
  }

}
</style>
