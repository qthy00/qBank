import { useUserStore } from '~/stores/user.ts'
import { useAppStore } from '~/stores/app.ts'
import { navigateTo } from '#imports'

// 设置分享信息参数
const getShareInfo = (
  scene = {
    title: '', // 自定义分享标题
    desc: '', // 自定义描述
    image: '', // 自定义分享图片
    params: {}, // 自定义分享参数
  },
  poster = {
    // 自定义海报数据
    type: 'user',
  },
) => {
  const appStore = useAppStore()

  const shareInfo = {
    title: '', // 分享标题
    desc: '', // 描述
    image: '', // 分享图片
    path: '', // 分享页面+参数
    link: '', // 分享Url+参数
    query: '', // 分享参数
    poster, // 海报所需数据
  }

  const shareConfig = appStore.platform.share

  // 自动拼接分享用户参数
  const query = buildSpmQuery(scene.params)
  shareInfo.query = query

  // 配置分享链接地址
  shareInfo.link = buildSpmLink(query, shareConfig.linkAddress)
  return shareInfo
}

// 构造spm分享参数
const buildSpmQuery = (params) => {
  const userStore = useUserStore()
  let shareId: number = 0 // 设置分享者用户ID
  if (typeof params.shareId === 'undefined') {
    if (userStore.isLogin) {
      shareId = userStore.user.id
    }
  }

  let page:number = 1; // 页面类型: 1=首页(默认),2=商品,3=分销商品...按需扩展
  if (typeof params.page !== 'undefined') {
    page = params.page
  }

  let query:number = 0; // 设置页面ID: 如工具series、分销ID等
  if (typeof params.query != 'undefined') {
    query = params.query
  }
  //spmParams = ...  可按需扩展
  return `spm=${shareId}.${page}.${query}`
}

// 构造分享链接
const buildSpmLink = (query, linkAddress = '') => {
  return `${linkAddress}?${query}`;
}

// 解析Spm
const decryptSpm = async (spm: string) => {
  const userStore = useUserStore()
  const { wsCache } = useCache()
  const shareParamsArray = spm.split('.')
  const shareParams = {
    spm,
    shareId: '0',
    page: '1',
    query: {
      series: '',
    },
  }

  shareParams.shareId = shareParamsArray[0]
  switch (shareParamsArray[1]) {
    case '1':
      // 默认首页不跳转
      shareParams.page = '/'
      break
    case '2':
      // 普通工具
      shareParams.page = `/t/${shareParamsArray[2]}`
      shareParams.query.series = shareParamsArray[2]
      break
  }
  if (shareParams.shareId !== '0') {
    // 已登录 立即添加分享记录
    if (!userStore.isLogin) {
      // 未登录 待用户登录后添加分享记录 （已注册用户不享有）
      wsCache.set(CACHE_KEY.SHARE_LOG, shareParams)
    }
  }
  if (shareParams.page !== '/') {
    await navigateTo({ path: shareParams.page })
  }
  return shareParams
}

export default {
  getShareInfo,
  decryptSpm,
};
