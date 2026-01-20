import { useAppStore } from '~/stores/app.ts'
import { useUserStore } from '~/stores/user.ts'
import type { PosterData, PosterItem } from '@/components/common/share/canvas-poster/poster/index.ts'

const tools = (poster) : PosterData => {
  const useStore = useUserStore()
  const appStore = useAppStore()
  const width = poster.width;
  const userInfo = useStore.user

  const list: PosterItem[] = [
    {
      name: 'nickname',
      type: 'text',
      val: userInfo.nickname,
      x: width * 0.22,
      y: width * 0.06,
      backgroundRadius: 8, // 圆角半径
      backgroundColor: '#d3d3d34d', // 背景色
      backgroundPadding: { x: 6, y: 4 }, // 背景与文字的内边距
      paintbrushProps: {
        fillStyle: '#fff',
        font: {
          fontSize: 16,
          fontFamily: 'sans-serif',
        },
      },
    },
    {
      name: 'avatar',
      type: 'image',
      val: userInfo.avatar,
      x: width * 0.04,
      y: width * 0.04,
      width: width * 0.14,
      height: width * 0.14,
      d: width * 0.14,
    },
    {
      name: 'qrcode',
      type: 'qrcode',
      val: poster.shareInfo.link,
      x: width * 0.7,
      y: width * 1.2,
      size: width * 0.2,
      backgroundPadding: { x: 10, y: 10 }, // 内边距大小（像素）
      backgroundColor: '#ffffff', // 内边距颜色（默认白色）
    },
  ]

  let background = poster.shareInfo.poster.bg
  if (background == undefined || background == null || background.trim() === '') {
    background = appStore.platform.share.posterInfo.tools_bg
    list.push(
      {
        name: 'goodsImage',
        type: 'image',
        val: poster.shareInfo.poster.image,
        x: width * 0.03,
        y: width * 0.21,
        width: width * 0.94,
        height: width * 0.94,
        r: 10,
      },
      {
        name: 'goodsPrice',
        type: 'text',
        val: '￥' + poster.shareInfo.poster.price,
        x: width * 0.04,
        y: width * 1.3,
        paintbrushProps: {
          fillStyle: '#ff0000',
          font: {
            fontSize: 20,
            fontFamily: 'OPPOSANS',
          },
        },
      },
      {
        name: 'goodsOriginalPrice',
        type: 'text',
        val:
          poster.shareInfo.poster.original_price > 0
            ? '￥' + poster.shareInfo.poster.original_price
            : '',
        x: width * 0.3,
        y: width * 1.32,
        paintbrushProps: {
          fillStyle: '#999',
          font: {
            fontSize: 10,
            fontFamily: 'OPPOSANS',
          },
        },
        textDecoration: {
          line: 'line-through',
          style: 'solide',
        },
      },
      {
        name: 'goodsTitle',
        type: 'text',
        val: poster.shareInfo.poster.title,
        x: width * 0.04,
        y: width * 1.18,
        maxWidth: width * 0.91,
        line: 2,
        lineHeight: 5,
        paintbrushProps: {
          fillStyle: '#333',
          font: {
            fontSize: 14,
          },
        },
      },
    )
  }else {
    list.push(
      {
        name: 'goodsTitle',
        type: 'text',
        val: poster.shareInfo.poster.title,
        x: width * 0.06,
        y: width * 0.25,
        maxWidth: width * 0.91,
        line: 2,
        lineHeight: 5,
        backgroundRadius: 8, // 圆角半径
        backgroundColor: '#d3d3d34d', // 背景色
        backgroundPadding: { x: 8, y: 4 }, // 背景与文字的内边距
        paintbrushProps: {
          fillStyle: '#fff',
          font: {
            fontSize: 22,
          },
        },
      }
    )
  }

  return {
    background,
    list,
  };
};

export default tools;
