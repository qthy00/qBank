import jweixin from 'weixin-js-sdk';
import { SocialApi } from '@/api/user/social.ts'

const message = useMessage()
let configSuccess = false;

export default {
  // 判断是否在微信中
  isWechat() {
    // noinspection EqualityComparisonWithCoercionJS
    return /MicroMessenger/i.test(navigator.userAgent.toLowerCase())
  },

  isReady(api) {
    jweixin.ready(api);
  },

  // 初始化 JSSDK
  async init(callback?: any) {
    if (!this.isWechat()) {
      message.warning('请使用微信网页浏览器打开');
      return;
    }

    // 调用后端接口，获得 JSSDK 初始化所需的签名
    const url = location.origin;
    const data = await SocialApi.createWeixinMpJsapiSignature(url);
    if (data) {
      jweixin.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
          'chooseWXPay',
          'openLocation',
          'getLocation',
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'scanQRCode',
        ],
        openTagList: data.openTagList,
      });
    } else {
      console.log('请求 JSSDK 配置失败');
    }

    // 监听结果
    configSuccess = true;
    jweixin.error((err) => {
      configSuccess = false;
      console.error('微信 JSSDK 初始化失败', err);
      message.error('微信JSSDK:' + err.errMsg);
    });
    jweixin.ready(() => {
      if (configSuccess) {
        console.log('微信 JSSDK 初始化成功');
      }
    });

    // 回调
    if (callback) {
      callback(data);
    }
  },

  // [2026-03-26] 以下三个功能经讨论决定暂不实现，已注释以清理技术债务
  // 原因：与学习场景无关联，ROI为0，待后续业务需要时再启用
  // 讨论文档：docs/discussion-wechat-location-20260326.md

  /*
  // 获取定位 - 暂未使用
  getLocation(callback) {
    this.isReady(() => {
      jweixin.getLocation({
        type: 'gcj02',
        success: function (res) {
          callback(res);
        },
        fail: function (res) {
          console.log('%c微信H5sdk,getLocation失败：', 'color:green;background:yellow');
        },
      });
    });
  },

  // 微信扫码 - 暂未使用
  scanQRCode(callback) {
    this.isReady(() => {
      jweixin.scanQRCode({
        needResult: 1,
        scanType: ['qrCode', 'barCode'],
        success: function (res) {
          callback(res);
        },
        fail: function (res) {
          console.log('%c微信H5sdk,scanQRCode失败：', 'color:green;background:yellow');
        },
      });
    });
  },

  // 打开坐标位置 - 暂未使用
  openLocation(data, callback) {
    this.isReady(() => {
      jweixin.openLocation({
        ...data,
        success: function (res) {
          console.log(res);
        },
      });
    });
  },
  */

  // 微信支付 - 实际使用中
  wxpay(data, callback) {
    this.isReady(() => {
      jweixin.chooseWXPay({
        timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
        package: data.packageValue, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: data.paySign, // 支付签名
        success: function (res) {
          callback.success && callback.success(res);
        },
        fail: function (err) {
          callback.fail && callback.fail(err);
        },
        cancel: function (err) {
          callback.cancel && callback.cancel(err);
        },
      });
    });
  },
};
