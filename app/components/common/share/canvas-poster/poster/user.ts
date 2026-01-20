import { useAppStore } from '~/stores/app.ts'
import { useUserStore } from '~/stores/user.ts'
import type { PosterData } from '@/components/common/share/canvas-poster/poster/index.ts'

const user = (poster) : PosterData => {
  const useStore = useUserStore()
  const appStore = useAppStore()
  const width = poster.width
  const userInfo = useStore.user

  return {
    background: appStore.platform.share.posterInfo.user_bg,
    list: [
      {
        name: 'nickname',
        type: 'text',
        val: userInfo.nickname,
        x: width / 2,
        y: width * 0.4,
        paintbrushProps: {
          textAlign: 'center',
          fillStyle: '#333',
          font: {
            fontSize: 14,
            fontFamily: 'sans-serif',
          },
        },
      },
      {
        name: 'avatar',
        type: 'image',
        val: userInfo.avatar,
        x: width * 0.4,
        y: width * 0.16,
        width: width * 0.2,
        height: width * 0.2,
        d: width * 0.2,
      },
      {
        name: 'qrcode',
        type: 'qrcode',
        val: poster.shareInfo.link,
        x: width * 0.35,
        y: width * 0.84,
        size: width * 0.3,
      },
    ],
  };
};

export default user;
