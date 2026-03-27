<template>
  <div class="change-avatar">
    <CropperAvatar
      ref="cropperRef"
      :btn-props="{ preIcon: 'ep:upload-filled' }"
      :show-btn="false"
      :value="img"
      width="120px"
      @change="handelUpload"
    />
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '~/utils/propTypes'
import { uploadAvatar } from '~/api/user'
import { CropperAvatar } from '~/components/Cropper'

defineOptions({ name: 'UserAvatar' })

defineProps({
  img: propTypes.string.def('')
})

const userStore = useUserStore()
const cropperRef = ref()
const handelUpload = async ({ data }) => {
  const res = await uploadAvatar({ avatarFile: data })
  cropperRef.value.close()
  if(res){
    await userStore.setUserAvatar(res)
  }
}
</script>

<style lang="scss" scoped>
.change-avatar {
  img {
    display: block;
    margin-bottom: 15px;
    border-radius: 50%;
  }
}
</style>
