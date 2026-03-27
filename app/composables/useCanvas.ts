import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { getPosterData } from '~/components/common/share/canvas-poster/poster'

interface PosterOptions {
    width: number
    height: number
    background?: string
    list?: Array<any>
}

export function useCanvas(options: PosterOptions, _vm?: any) {
    const canvasRef: Ref<HTMLCanvasElement | null> = ref(null)
    const posterImage = ref('')

    const isClient = typeof window !== 'undefined'

    onMounted(async () => {
        if (!isClient || !canvasRef.value) return

        try {
            // 动态导入 fabric，避免 SSR 报错
            const { $fabric } = useNuxtApp()
            const { StaticCanvas, Text, Image, Circle, Rect } = $fabric

            const drawer = getPosterData(options)

            // 创建画布
            const canvas = new StaticCanvas(canvasRef.value, {
                width: options.width,
                height: options.height,
                preserveObjectStacking: true
            })

            // 1. 背景图
            if (drawer?.background) {
                const backgroundImg = await loadImageWithCORS(drawer.background)
                const backgroundWidth = options.width
                const backgroundHeight = (backgroundImg.height / backgroundImg.width) * backgroundWidth

                canvas.setWidth(backgroundWidth)
                canvas.setHeight(backgroundHeight)

                const background = new Image(backgroundImg, {
                    left: 0,
                    top: 0,
                    width: backgroundWidth,
                    height: backgroundHeight
                })
                canvas.add(background)
                background.moveTo(0) // 确保在最底层
            }

            // 2. 绘制其他元素
            const list = drawer?.list || []
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                switch (item.type) {
                    case 'text':
                        await drawText(canvas, Text, item, i + 1)
                        break
                    case 'image':
                        await drawImage(canvas, Image, Circle, Rect, item, i + 1)
                        break
                    case 'qrcode':
                        await drawQrCode(canvas, Image, item, i + 1)
                        break
                }
            }

            canvas.renderAll()
            posterImage.value = canvas.toDataURL('image/png')
        } catch (err) {
            console.error('绘制海报失败:', err)
        }
    })

    /** 加载图片并处理跨域 */
    function loadImageWithCORS(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => resolve(img)
            img.onerror = (err) => reject(err)
            img.src = url
        })
    }

    /** 绘制文本 */
    async function drawText(canvas: any, FabricText: any, item: any, zIndex: number) {
        const text = new FabricText(item.text, {
            left: item.x,
            top: item.y,
            fontSize: item.fontSize || 14,
            fill: item.color || '#000',
            fontWeight: item.fontWeight,
            fontFamily: item.fontFamily || 'Arial',
            textAlign: item.textAlign || 'left'
        })

        if (item.lineHeight) {
            text.set('lineHeight', item.lineHeight)
        }

        if (item.maxWidth) {
            text.set({
                width: item.maxWidth,
                overflow: 'hidden',
                splitByGrapheme: true
            })
        }

        canvas.add(text)
        text.moveTo(zIndex)
    }

    /** 绘制图片 */
    async function drawImage(canvas: any, FabricImage: any, Circle: any, Rect: any, item: any, zIndex: number) {
        try {
            const img = await loadImageWithCORS(item.val)
            const image = new FabricImage(img, {
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height
            })

            // 圆形裁剪
            if (item.d) {
                const circle = new Circle({
                    radius: item.d / 2,
                    left: item.x,
                    top: item.y,
                    originX: 'left',
                    originY: 'top'
                })
                image.set('clipPath', circle)
            }

            // 圆角矩形裁剪
            if (item.r) {
                const rect = new Rect({
                    left: item.x,
                    top: item.y,
                    width: item.width,
                    height: item.height,
                    rx: item.r,
                    ry: item.r,
                    originX: 'left',
                    originY: 'top'
                })
                image.set('clipPath', rect)
            }

            canvas.add(image)
            image.moveTo(zIndex)
        } catch (err) {
            console.error('绘制图片失败:', err)
        }
    }

    /** 绘制二维码 */
    async function drawQrCode(canvas: any, FabricImage: any, item: any, zIndex: number) {
        try {
            const img = await loadImageWithCORS(item.val)
            const qrcode = new FabricImage(img, {
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height
            })
            canvas.add(qrcode)
            qrcode.moveTo(zIndex)
        } catch (err) {
            console.error('绘制二维码失败:', err)
        }
    }

    return {
        canvasRef,
        posterImage
    }
}
