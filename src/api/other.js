import axios from '@/utils/request'

const redirect_uri = encodeURIComponent('http://h5.bvcio.com/#/login')


export default {
  // 逆向解析地址
  getUserLocation: (latitude, longitude) => {
    return axios.post('http://www.zeallyle.com/txmap', {
      location: latitude + ',' + longitude
    })
  },
  // 登录
  login: data => {
    return axios.post('v1/login', data)
  },

  //微信登录
  wechat: (data, code) => {
    return axios.post('v1/wechat/login/wx19bdb96099591fef' + '/' + code, data)
  },
  

  // 微信登录
  wechatLogin: () => {
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx19bdb96099591fef&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=wechat#wechat_redirect`
  },

  // qq登录
  qqLogin: () => {
    window.location.href = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101506589&redirect_uri=${redirect_uri}&state=qq`
  },

  // 微博登录
  weiboLogin: () => {
    window.location.href = `https://api.weibo.com/oauth2/authorize?client_id=956654164&response_type=code&redirect_uri=${redirect_uri}&state=wb`
  },

  // 第三方登录回调
  otherLoginCallBack: (type, code) => {
    return axios.post('http://www.zeallyle.com/login/' + type, {
      code,
      redirect_uri
    })
  },

  // 绑定第三方登录
  bindOtherLogin: data => {
    return axios.put('bind_third_party_account', data, {
      hasToken: true
    })
  },
  // 解除第三方绑定
  unbindOtherLogin: data => {
    return axios.put('unbind_third_party_account', data, {
      hasToken: true
    })
  },

  // 注册、绑定手机号
  register: data => {
    return axios.post('register', data)
  },

  // 获取验证码
  gitVerifyCode: data => {
    return axios.post('sms', data)
  },

  // 验证手机号是否注册
  isRegisterTel: phone => {
    return axios.get('is_register/' + phone)
  },

  // 忘记密码
  forgetPw: data => {
    return axios.put('forget/password', data)
  },

  // 重置密码
  resetPw: data => {
    return axios.put('reset/password', data)
  },

  /* 上传图片至七牛 */

  // 获取七牛Token
  getQnToken: () => {
    return axios.get('qn_token')
  },

  // 上传至七牛
  uploadQn: data => {
    return axios.post('https://upload-z1.qiniup.com', data)
  },

  // 汇率
  getExchangeRate: data => {
    return axios.get('exchange/show')
  },

  // 触发来消息
  dispatchMsg: data => {
    return axios.post('http://www.zeallyle.com/ws/msg', data)
  },

  // 获取用户ip
  getUserIp: () => {
    return axios.get('get_client_ip')
  },

  // 获取app下载地址
  getAppDownloadLink: () => {
    return axios.get('get_new_version')
  },

  //用户在广告详情获取优惠券
  getDeatailsCoupon (data,adID,shareID) {
    return axios.post('publish/coupon/' + adID + '/' + shareID, data, {
      hasToken: true
    })
  }
}
