import $wxsdk from './sdk-h5-weixin'
import { getRootUrl } from '@/utils/routerHelper.ts'

import * as LoginApi from '@/api/login'
import { SocialApi } from '@/api/user/social'

const { wsCache } = useCache()

const socialType = 31; // 社交类型 - 微信公众号

// 加载微信公众号JSSDK
async function load() {
  await $wxsdk.init();
}


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
    let url = data.split('&redirect_uri')[0]
    return  url + '&redirect_uri=' + encodeURIComponent(redirectUri)
  } catch (e){}
}

// 微信公众号绑定
async function bind(code = '', state = '') {
  // 情况一：没有 code 时，去获取 code
  if (code === '') {
    const loginUrl = await getLoginUrl('bind');
    if (loginUrl) {
      wsCache.set('returnUrl', location.href);
      window.location = loginUrl;
    }
  } else {
    // 情况二：有 code 时，使用 code 去自动绑定
    const data = {
      type: socialType,
      code,
      state,
    }
    const loginResult = await SocialApi.socialBind(data);
    if (loginResult.code === 0) {
      setOpenid(loginResult.data);
      return loginResult;
    }
  }
  return false;
}

// 微信公众号解除绑定
const unbind = async (openid) => {
  const data = {
    type: socialType,
    openid,
  }
  const res = await SocialApi.socialUnbind(data);
  return res !== undefined || res !== null;
};

// 获取公众号登陆地址
async function getLoginUrl(event = 'login') {
  const page = getRootUrl() + 'pages/index/login' + '?event=' + event; // event 目的，区分是 login 还是 bind
  const { code, data } = await LoginApi.socialAuthRedirect(socialType, page);
  if (code !== 0) {
    return undefined;
  }
  return data;
}

// 设置 openid 到本地存储，目前只有 pay 支付时会使用
function setOpenid(openid) {
  wsCache.set('openid', openid);
}

// 获得 openid
async function getOpenid(force = false) {
  let openid = wsCache.get('openid');
  if (!openid && force) {
    const info = await getInfo();
    if (info && info.openid) {
      openid = info.openid;
      setOpenid(openid);
    }
  }
  return openid;
}

// 获得社交信息
async function getInfo() {
  const { code, data } = await SocialApi.getSocialUser(socialType);
  if (code !== 0) {
    return undefined;
  }
  return data;
}

export default {
  load,
  beforeBind,
  bind,
  unbind,
  getInfo,
  getOpenid,
  jsWxSdk: $wxsdk,
};
