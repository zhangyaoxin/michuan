import axios from '@/utils/request'

export default {
  // 创建广告
  createdAd(data) {
    return axios.post('advertise', data, {
      hasToken: true
    })
  },

  // 编辑广告
  editAdInfo(data, id) {
    return axios.put('advertise/' + id, data, {
      hasToken: true
    })
  },

  // 删除广告
  delAdInfo(id) {
    return axios.delete('advertise/' + id, {
      hasToken: true
    })
  },

  // 获取广告详情
  // getAdDetails: data => {
  //   return axios.get('advertise_detail/', {
  //     params: data
  //   })
  // },
  getAdDetails (data,id)  {
    return axios.get('publish/advertise/' + id,{
      params: data
    })
  },

  // 获取广告列表
  getAdList: data => {
    return axios.get('advertise', {
      params: data,
      hasToken: true
    })
  },

  // 获取广告的奖励
  getAdReward: data => {
    return axios.post('advertise/read', data, {
      hasToken: true
    })
  },

  // 查询广告的奖励值
  getAdRewardValue: data => {
    return axios.get('read_award', {
      params: data,
      hasToken: true
    })
  },

  // 获取我的浏览
  getMyBrowse: data => {
    return axios.get('my_browse', {
      params: data,
      hasToken: true
    })
  },

  // 获取我的用券明细
  getMyCouponList: data => {
    return axios.get('advertise_coupon', {
      params: data
    })
  },

  // 使用优惠券
  useCardCoupon: data => {
    return axios.post('coupon_use', data, {
      hasToken: true
    })
  },

  // 删除优惠券
  delCouponInfo: id => {
    return axios.delete('coupon_destroy/' + id, {
      hasToken: true
    })
  },

  // 获取我的影响力明细 和 获取我的分享明细
  getMyInfluenceList: data => {
    return axios.get('adv_influence', {
      params: data
    })
  },

  // 获取分享配置
  getShareConfig: url => {
    return axios.get('share_config', {
      params: url
    })
  },

  //申请JSSDKCONFIG
  getShareUrl (appID, data) {
    return axios.post('wechat/jssdk/config/' + appID, data,{
      hasToken: true
    })
  },

  // 分享成功回调
  shareSuccessCb: id => {
    return axios.get('count_share?adv_id=' + id)
  },

  // 获取用户发布浏览统计
  getUserPutCount: () => {
    return axios.get('personal_adv_count', {
      hasToken: true
    })
  }
}
