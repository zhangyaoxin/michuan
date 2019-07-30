import axios from '@/utils/request'

export default {
  getCarousel: data => {
    return axios.get('carousel', data)
  },

  // 获取验证码
  gitVerifyCode: data => {
    return axios.post('/sms', data)
  },

  // 搜索相关用户
  getSearchUser: (id, data) => {
    return axios.get('user_list', {
      params: {
        user_id: id,
        ...data
      }
    })
  },

  // 搜索商户列表
  searchShop: (data) => {
    return axios.get('/merchant/search/list', {
      params: data,
      hasToken: true
    })
  }
}
