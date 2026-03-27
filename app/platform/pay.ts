import $wxsdk from './wechat/sdk-h5-weixin'
import platform from './index.ts'
import { type OrderResultVO, type OrderSubmitVO, submitOrder } from '@/api/pay'
import { copyToClipboard } from '@/utils'
import { usePayDialogStore } from '@/stores/payDialog'


/**
 * 支付
 *
 * @param {String} payment = ['wechat','alipay','wallet','mock']  	- 支付方式
 * @param {String} orderType = ['goods','recharge','groupon']  	- 订单类型
 * @param {String} id          - 订单号
 */

export default class HyPay {
  private readonly payment: string
  private readonly id: number
  private readonly orderType: string
  private readonly returnUrl: string

  constructor(payment: string, orderType: string, id: number, returnUrl: string) {
    this.payment = payment
    this.id = id
    this.orderType = orderType
    this.returnUrl = returnUrl
    this.payAction()
  }

  payAction() {
    const payAction = {
      PC: {
        wechat: () => {
          this.wechatNativePay() // native 扫码支付
        },
        alipay: () => {
          this.aliPay()
        },
        wallet: () => {
          this.walletPay()
        },
      },
      H5: {
        wechat: () => {
          this.wechatNativePay() // H5 微信支付
        },
        alipay: () => {
          this.redirectPay()
        },
        wallet: () => {
          this.walletPay()
        },
      },
      WechatOfficialAccount: {
        wechat: () => {
          this.wechatOfficialAccountPay() // JSAPI支付
        },
        alipay: () => {
          this.redirectPay() // 现在公众号可以直接跳转支付宝页面
        },
        wallet: () => {
          this.walletPay()
        },
      },
    }
    return payAction[platform.name][this.payment]()
  }

  // 预支付
  async prepay(channel: string): Promise<OrderResultVO> {
    const data: OrderSubmitVO = {
      id: this.id,
      channelCode: channel,
      returnUrl: this.returnUrl,
      channelExtras: {},
    }

    if (['wx_pub', 'wx_lite'].includes(channel)) {
      const openid = await platform.useProvider('wechat').getOpenid()
      if (!openid) {
        this.goBindWechat()
        throw new Error('缺少 openid')
      }
      data.channelExtras.openid = openid
    }

    try {
      return await submitOrder(data)   // 直接 return
    } catch (e: any) {
      if (typeof e === 'string') {
        if (
          e.indexOf('无效的openid') >= 0 ||
          e.indexOf('下单账号与支付账号不一致') >= 0
        ) {
          this.goBindWechat()
        }
      }
      throw e  // 往外抛，让调用方能处理
    }
  }

  async wechatNativePay() {
    const data = await this.prepay('wx_native')
    // 显示扫码弹窗
    const payDialog = usePayDialogStore()
    payDialog.show(data.displayContent)
  }

  // 微信公众号 JSSDK 支付
  async wechatOfficialAccountPay() {
    const message = useMessage()
    const data = await this.prepay('wx_pub')
    if (!data) {
      return
    }
    const payConfig = JSON.parse(data.displayContent)
    $wxsdk.wxpay(payConfig, {
      success: () => {
        this.payResult('success')
      },
      cancel: () => {
        message.warning('支付已手动取消')
      },
      fail: (error: any) => {
        if (error.errMsg.indexOf('chooseWXPay:没有此SDK或暂不支持此SDK模拟') >= 0) {
          message.error(
            '发起微信支付失败，原因：可能是微信开发者工具不支持，建议使用微信打开网页后支付',
          )
          return
        }
        this.payResult('fail')
      },
    })
  }

  // 浏览器微信 H5 支付 TODO 待接入（虚拟产品不让申请）
  async wechatWapPay() {
    try {
      const data = await this.prepay('wx_wap')
    } catch (e: any) {
      // const redirect_url = `${getRootUrl()}pages/pay/result?id=${this.id}&payment=${this.payment}&orderType=${this.orderType}`
      // location.href = `${data.pay_data.h5_url}&redirect_url=${encodeURIComponent(redirect_url)}`
    }
  }

  // 支付链接
  async redirectPay() {
    const { displayContent } = await this.prepay('alipay_wap')
    location.href = displayContent
  }

  async aliPay() {
    const { displayContent } = await this.prepay('alipay_pc')
    location.href = displayContent
  }

  // 余额支付
  async walletPay() {
    await this.prepay('wallet')
    this.payResult('success')
  }

  // 支付宝复制链接支付（通过支付宝 wap 支付实现）
  async copyPayLink() {
    const message = useMessage()
    const data = await this.prepay('alipay_wap')
    if(!data) return
    // 点击确认：复制链接；
    await message.confirm('复制链接到外部浏览器', '支付宝支付')
    await copyToClipboard(data.displayContent)
  }

  // 支付结果跳转,success:成功，fail:失败
  payResult(resultType: string) {
    goPayResult(this.id, this.orderType, resultType)
  }

  // 引导绑定微信
  goBindWechat() {
    goBindWechat()
  }
}

// 支付结果跳转,success:成功，fail:失败
export function goPayResult(id: number, orderType: string, resultType: string) {
  const {push} = useRouter()
  push({
    path: '/pages/pay/result',
    query: {
      id,
      orderType,
      payState: resultType,
    }
  })
}

export function goBindWechat() {
  const message = useMessage()
  message.confirm('请先绑定微信再使用微信支付', '微信支付').then(() => {
    platform.useProvider('wechat').bind()
  })
}
