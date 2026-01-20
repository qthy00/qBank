let service
// 检测是否在微信浏览器中
const isWechat = /MicroMessenger/i.test(navigator.userAgent)

if (isWechat) {
  // 微信环境
  service = import('./officialAccount')
} else {
  // 其他环境
  service = import('./openPlatform')
}
const wechat = service

export default wechat
