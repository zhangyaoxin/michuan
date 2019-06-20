/**
 * *AXIOS通用的设置
 * @Author: Lyle
 * @Date: 2018-10-12 14:42:49
 * @Last Modified by: Lyle
 * @Last Modified time: 2018-10-13 17:45:18
 */

import axios from 'axios'
import store from '@/store'

import {
  getStore,
  removeStore,
  browserVersions
} from '@/utils/utils'

// axios 基础配置
axios.defaults.timeout = 10000
axios.defaults.baseURL = 'http://h5.bvcio.com/api/'
// axios.defaults.baseURL = 'http://demo.michuan.online/api/'


// request请求拦截
axios.interceptors.request.use(
  // 在请求发送之前做一些事
  config => {
    if (config.hasToken) {
      const token = getStore('token', 'localStorage')
      config.headers['mc-token'] = token
      config.headers.platform = browserVersions().mobile || browserVersions().iPad ? 2 : 3
    }
    return config
  },
  // 当出现请求错误是做一些事
  err => {
    console.log('err' + err)
  }
)

// respone拦截器
axios.interceptors.response.use(
  res => {
    const url = res.config.url.split('/').pop()
    const data = res.data
    if (!data.status) {
      const loginList = [500, 502]
      if (loginList.includes(data.response_code)) {
        store.commit('changeValue', {
          type: 'isLogin',
          value: false
        })
        removeStore('token', 'localStorage')
        removeStore('userInfo')
      }
    }
    return res.data
  },
  err => {
    console.log('err => ', err)
    store.commit('changeValue', {
      type: 'isLogin',
      value: false
    })
    removeStore('token', 'localStorage')
    removeStore('userInfo')
  }

)

export default axios
