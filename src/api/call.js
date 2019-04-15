import axios from '@/utils/request'


export default {
  // 拨号
  confirmCall: callnumber => {
    return axios.post('xunbang', callnumber, {
      hasToken: true
    })
  },

  // 通话记录
  getCallOrder: (type, data) => {
    return axios.get('account/order_list/' + type, {
      params: data,
      hasToken: true
    })
  },
}
