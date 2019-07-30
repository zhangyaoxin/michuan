/**
 * *状态管理 State
 * @Author: Lyle
 * @Date: 2018-10-12 14:11:34
 * @Last Modified by: Lyle
 * @Last Modified time: 2018-10-13 18:25:50
 */

import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

import ad from './module/ad'

Vue.use(Vuex)

const state = {
  isLogin: false,

  userInfo: {},

  account: {},

  // 判断用户是否为点位主
  pointMaster: false,

  // 获取验证码
  timer: null,
  showReminderTime: false,
  reminderTime: 60,

  qiniuBaseUrl: 'http://res.michuan.online/',
  h5BaseUrl: 'http://h5.bvcio.com/',
  // h5BaseUrl: 'http://47.92.250.127/',
  // 有赞云
  setyzp: false,
  // 定位信息
  addressData: {
    city: '',
    poi: ''
  },
  // 汇率
  buyExchange: 0,
  sellExchange: 0,
  payExchange: 0,

  // 未读消息数量
  unreadMsgList: {},
  msg: [],

  // 电话盘控制
  isShowDialpadMd: false
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    ad
  }
})
