import { SocialApi } from '@/api/user/social'
import * as LoginApi from '@/api/login'

const { wsCache } = useCache()
const socialType = 32 // 社交类型 - 开放平台 (要绑定的类型，目前是开放平台登录和绑定的）


async function beforeBind(path, query) {
  console.log('社交类型===', socialType)
  try {
    let redirectUri = `https://www.gongjua.cn${path}?event=bind&type=${socialType}`
    for (const key in query) {
      // 推荐添加类型检查，避免遍历到原型链上的属性
      if (query.hasOwnProperty(key)) {
        redirectUri += '&' + key + '=' + query[key]
      }
    }
    const data = await LoginApi.socialAuthRedirect(socialType, encodeURIComponent(redirectUri))
    const url = data.split('&redirect_uri')[0]
    return  url + '&redirect_uri=' + encodeURIComponent(redirectUri)
  } catch (e){}
}


// 微信 App 绑定
const bind = async (code, state) => {
  const data = {
    type: socialType,
    code,
    state,
  }
  const res = await SocialApi.socialBind(data)
  return !!res
}

// 微信 App 解除绑定
const unbind = async (openid) => {
  const data = {
    type: socialType,
    openid,
  }
  const res = await SocialApi.socialUnbind(data)
  return !!res
}

// 设置 openid 到本地存储，目前只有 pay 支付时会使用
function setOpenid(openid) {
  wsCache.set('openid', openid)
}

// 获得 openid
async function getOpenid(force = false) {
  let openid = wsCache.get('openid')
  if (!openid && force) {
    const info = await getInfo()
    if (info && info.openid) {
      openid = info.openid
      setOpenid(openid)
    }
  }
  return openid
}

// 获得社交信息
async function getInfo() {
  const data = await SocialApi.getSocialUser(socialType)
  if (data) {
    return data
  }
  return undefined
}

export default {
  beforeBind,
  bind,
  unbind,
  getInfo,
  getOpenid,
}
