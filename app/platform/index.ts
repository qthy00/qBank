/**
 * 平台功能聚合
 * @version 1.0.0
 * @author Lilia
 * @param {String} name - 厂商+平台名称
 * @param {String} provider - 厂商
 * @param {String} platform - 平台名称 (h5手机浏览器 | pc电脑浏览器 | 微信内置浏览器)
 */
import { isMobile, isWxBrowser } from '@/utils/is'

import wechat from './wechat'
import HyPay from './pay'

let name = ''
let provider = ''
let platform = ''

if (isWxBrowser()) {
  name = 'WechatOfficialAccount'
  provider = 'wechat'
  platform = 'officialAccount'
} else if (isMobile()) {
  name = 'H5'
  platform = 'h5'
} else {
  name = 'PC'
  platform = 'pc'
}

// 加载当前平台前置行为
const load = () => {
  if (provider === 'wechat') {
    wechat.load()
  }
}

// 使用厂商独占sdk name = 'wechat' | 'alipay'
const useProvider = (_provider = '') => {
  if (_provider === '') _provider = provider
  if (_provider === 'wechat') return wechat
}

// 支付服务转发
const pay = (payment: string, orderType: string, orderSN: number, returnUrl: string) => {
  return new HyPay(payment, orderType, orderSN, returnUrl)
}

const _platform = {
  name,
  provider,
  platform,
  useProvider,
  pay,
  load
}

export default _platform
