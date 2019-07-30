import axios from '@/utils/request'
import store from '@/store'

export default {

  // 个人中心 
  getMeInfo: (id = '') => {
    return axios.get('me/' + id, {
      hasToken: store.state.isLogin ? true : !id ? true : false
    })
  },

  // 用户账户绑定情况
  getUserBindDetail: () => {
    return axios.get('get_user_bind_detail', {
      hasToken: true
    })
  },

  // 修改用户信息
  editUserInfo: data => {
    return axios.put('me/update', data, {
      hasToken: true
    })
  },

  // 关注、取消关注
  changeAttent: data => {
    return axios.post('concern', data, {
      hasToken: true
    })
  },

  // 获取用户粉丝的列表
  getUserFansList: (id, data) => {
    return axios.get('fans/' + id, {
      params: data,
      hasToken: store.state.isLogin
    })
  },

  // 获取用户关注的列表
  getUserAttentList: (id, data) => {
    return axios.get('concerns/' + id, {
      params: data,
      hasToken: store.state.isLogin
    })
  },

  // 获取签到信息
  getSignInfo(data) {
    return axios.get('getSignInfo', {
      params: data
    })
  },

  // 用户签到
  userSignIn(data) {
    return axios.get('userSignIn', {
      params: data
    })
  },

  // 账户详情
  getAccountInfo: () => {
    return axios.get('account', {
      hasToken: true
    })
  },

  // 账户明细
  getAccountDetail: (data) => {
    return axios.get('account/detail', {
      params: data,
      hasToken: true
    })
  },

  // 有赞云同步到本地
  getyzpData: (data) => {
    return axios.post('/common/redeem/yzp/to/cg', data, {
      hasToken: true
    })
  },

  // 本地同步到有赞云
  setyzpData: (data) => {
    return axios.post('/common/redeem/cg/to/yzp', data, {
      hasToken: true
    })
  },

  // 我的等级,徽章列表
  getLevelBadge: (data) => {
    return axios.get('badge', {
      params: data,
      hasToken: true
    })
  },

  // 微信充值
  rechargeWx: (data) => {
    return axios.post('recharge/wx', data, {
      hasToken: true
    })
  },

  // 充值卡充值
  rechargeCard: data => {
    return axios.post('recharge/card', data, {
      hasToken: true
    })
  },

  // 查询订单结果
  getOrderResult: (type, id) => {
    console.log(type, id, 'type, id')
    return axios.get(`account/order_detail/${type}/${id}`, {
      hasToken: true
    })
  },

  // 查询订单 - 超哥
  getOrderResultRPC: (type, data) => {
    return axios.get('account/order_list/' + type, {
      params: data,
      hasToken: true
    })
  },

  // 微信提现
  withdrawWx: (data) => {
    return axios.post('transfer/wx', data, {
      hasToken: true
    })
  },

  // 意见反馈
  postFeedBack: data => {
    return axios.post('suggestion/store', data, {
      hasToken: true
    })
  },

  // 获取消息列表
  getUserMsgList: data => {
    return axios.get('message/type_list', {
      hasToken: true
    })
  },

  // 获取某个消息列表下的消息列表
  getMsgTypeDetail: type => {
    return axios.get('message/index/' + type, {
      hasToken: true
    })
  },

  // 一键已读
  getMsgReadAll: type => {
    return axios.get('message/read_all/' + type, {
      hasToken: true
    })
  }
}
