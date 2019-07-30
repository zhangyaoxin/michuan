import api from '@/api'
import {
  Toast
} from 'vant'

import wx from 'wx'

const state = {
  title: '',
  summary: '',

  thumbnail: {
    url: '',
    link: ''
  },

  rewardType: 0,
  preBvt: '',
  browseBvt: '',
  shareBvt: '',
  bvtNum: '',

  curCouponIndex: 0,
  couponList: [],

  content: [],

  is_show: 0,

  total_sent: '',
  left_bvt: '',

  shareConfig: {}
}

const getters = {
  curCoupon(state) {
    return state.couponList[state.curCouponIndex]
  }
}

const mutations = {

  changeAd(state, {
    type,
    stype = false,
    val
  }) {
    if (stype) {
      state[type][stype] = val
    } else {
      state[type] = val
    }
  },

  resetState(state) {
    const data = {
      title: '',
      summary: '',

      rewardType: 0,
      preBvt: '',
      browseBvt: '',
      shareBvt: '',
      bvtNum: '',

      thumbnail: {
        url: '',
        link: ''
      },

      content: [],

      curCouponIndex: 0,
      couponList: []
    }
    for (let it in data) {
      state[it] = data[it]
    }
  },


  // 删除奖励
  delAdReward(state) {
    state.rewardType = 0
    state.preBvt = 0
    state.browseBvt = 0
    state.shareBvt = 0
    state.bvtNum = 0
  },

  // 添加或编辑优惠券
  changeCoupon(state, {
    isAdd,
    data
  }) {
    console.log(isAdd, data, 'pppppppppp')
    if (isAdd) {
      state.couponList.push(data)
    } else {
      const i = state.curCouponIndex
      state.couponList.splice(i, 1, data)
    }
  },
  // 删除
  delCurCoupon(state) {
    const i = state.curCouponIndex
    state.couponList.splice(i, 1)
  },

}

const actions = {
  async confirmPut({
    state
  }, {
    status,
    id = ''
  }) {
    console.log(status, id)
    let {
      title,
      summary: sub_title,
      thumbnail,
      content,

      rewardType: type,
      preBvt: pre_bvt,
      browseBvt: browse_bvt,
      shareBvt: share_bvt,
      bvtNum: amount,
      couponList: coupon,
      is_show,
      left_bvt
    } = state
    coupon = coupon.map(it => {
      if (it.id) {
        it.coupon_id = it.id
      }
      return it
    })

    const params = {
      title,
      sub_title,
      thumbnail: JSON.stringify(thumbnail),
      content: JSON.stringify(content),
      type,
      pre_bvt,
      browse_bvt,
      share_bvt,
      amount,
      coupon: JSON.stringify(coupon),
      is_show,

      status
    }
    console.log(params)
    let par = 'createdAd'
    if (id) {
      par = 'editAdInfo'
      params.pre_bvt = left_bvt
    }
    const res = await api[par](params, id)
    return res
  },

  // 获取微信分享配置
  getShareConfig({
    state,
    commit
  }, params) {
    // 分享配置
    return api.getShareConfig({
        url: window.location.href.split('#')[0]
      })
      .then(data => {
        const {
          debug,
          appId,
          timestamp,
          nonceStr,
          signature,
          jsApiList
        } = data

        wx.config({
          debug: false,
          appId,
          timestamp,
          nonceStr,
          signature,
          jsApiList
        })
        return true
      })
  },

  // 设置分享内容
  setShareInfo({
    dispatch
  }, params) {
    console.log(params)
    wx.ready(() => {
      wx.onMenuShareAppMessage({
        title: params.title,
        desc: params.desc,
        link: params.link,
        imgUrl: params.imgUrl,
        success: function () {
          dispatch('shareSuccessCb', params.id)
        }
      })

      wx.onMenuShareTimeline({
        title: params.title,
        link: params.link,
        imgUrl: params.imgUrl,
        success: function () {
          dispatch('shareSuccessCb', params.id)
        },
      })

      wx.updateAppMessageShareData({
        title: params.title,
        desc: params.desc,
        link: params.link,
        imgUrl: params.imgUrl,
        success: function () {
          dispatch('shareSuccessCb', params.id)
        }
      })

      wx.updateTimelineShareData({
        title: params.title,
        link: params.link,
        imgUrl: params.imgUrl,
        success: function () {
          dispatch('shareSuccessCb', params.id)
        }
      })

    })
    wx.error((res) => {
      Toast('wx.ready 失败了')
    })
  },

  // 分享成功回调
  shareSuccessCb(ctx, id) {
  
    api.shareSuccessCb(id)
      .then(data => {
        console.log('成功')
       })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
