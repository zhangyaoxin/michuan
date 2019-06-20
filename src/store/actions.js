/**
 * *状态管理 Actions
 * @Author: Lyle
 * @Date: 2018-10-12 17:05:52
 * @Last Modified by: Lyle
 * @Last Modified time: 2018-10-13 15:50:31
 */

import api from '@/api'
import router from '@/router'

import {
  setStore,
  getStore,
  removeStore
} from '@/utils/utils'
import {
  ws,
  connection
} from '@/utils/msg_ws'

import {
  validate
} from '@/assets/js/validate'
import {
  Toast
} from 'vant'

const actions = {

  // 获取验证码
  gitVerifyCode ({
    commit,
    state
  }, data) {
    const res = validate({
      tel: {
        val: data.phone,
        isMsg: true
      }
    })

    if (res) {
      return new Promise((resolve, reject) => {
        api.gitVerifyCode(data)
          .then(data => {
            if (data.status) {
              const date = new Date().getTime()
              setStore('verifyTime', date)
              commit('setTimer')
              Toast('验证码已发送')
            } else {
              if (data.response_code === 300) {
                Toast('您输入的电话号码格式不正确！')
                return false
              }
              Toast(data.msg)
            }
            return data.status
          })
      })
    }
  },

  // 登录
  login ({
    commit,
    dispatch
  }, params) {
    console.log(params, '登录参数')
    api.login(params)
      .then(async data => {
        console.log('登录结果 ==>', data)
        if (data.status) {
          setStore('token', data.data.token, 'localStorage')
          const params = {
            appID: 'wxdddfda3352cb6a08',
            url: window.location.href.split('#')[0]
          }
          const appID = "wxdddfda3352cb6a08"
          api.getShareUrl(appID, params)
          .then(data => {
            console.log(data)
          })
          // 跳回原来地址
          let fromPath = getStore('fromPath')
          let routePath = {
            path: '/',
            query: {}
          }
          if (fromPath) {
            routePath = JSON.parse(fromPath)
          }
          if (routePath.path !== 'me') {
            // 获取用户信息
            const {
              res,
              data: info
            } = await dispatch('getUserInfo')
            if (!res) return false
            setStore('userInfo', info)
          }
          commit('changeValue', {
            type: 'isLogin',
            value: true
          })
          Toast('登录成功')
          // 连接长连接
          connection()
          // if (routePath.isOther) {
          //   router.go(-2)
          //   return false
          // }
          router.replace(routePath)
        } else {
          if (data.response_code === 10102) {
            if (params.auth_server === 4) {
              Toast('账户或密码错误')
              return false
            }
            setStore('otherLogin', params)
            router.push('bind_tel')
          } else if (data.response_code === 10108) {
            api.unbindOtherLogin({
              auth_server: params.auth_server
            })
              .then(data => {
                if (data.status) {
                  setStore('isBind', 0)
                  api.wechatLogin()
                }
              })
          } else {
            Toast(data.msg)
          }
        }
      })
  },

  async handleBindOtherLogin ({
    dispatch
  }, {
    code,
    type,
    isBindWx
  }) {
    const otherType = type === 'wechat' ? 1 :
      type === 'qq' ? 2 :
        type === 'wb' ? 3 :
          ''
    const {
      openid,
      unionid,
      nickname,
      headimgurl,
      ...res
    } = await api.otherLoginCallBack(type, code)
    console.log('openid  unionid ==>', openid, unionid, nickname, headimgurl, res)
    


    const params = {
      auth_server: otherType,
      credential_web_openid: openid,
      credential_unionid: unionid,
      nickname: nickname,
      headimgurl: headimgurl
    }

    const {
      status,
      response_code,
      msg
    } = await api.bindOtherLogin(params)
    console.log('statusstatusstatusstatus ==>', status)

    if (status) {
      Toast.success('绑定成功')
      return res
    } else {
      if (response_code === 10108) {
        api.unbindOtherLogin({
          auth_server: otherType
        })
          .then(data => {
            if (data.status) {
              setStore('isBind', 3)
              setStore('isBindWx', 1)
              api.wechatLogin()
            }
          })
      } else if (response_code === 10109) {
        Toast.fail(msg)
      } else {
        Toast.fail('绑定失败')
      }
    }
    return status
  },

  // 退出登录
  signOut ({
    commit
  }) {
    removeStore('token')
    removeStore('userInfo')
    removeStore('token', 'localStorage')
    commit('changeValue', {
      type: 'isLogin',
      value: false
    })
    commit('changeValue', {
      type: 'account',
      value: 0
    })
    ws.close()
    router.push('me')
  },

  // 关注、取消关注
  changeAttent ({
    commit,
    state
  }, params) {
    const tip = params.type === 1 ? '关注成功' : '取消关注'
    return api.changeAttent(params)
      .then(data => {
        if (data.status) {
          Toast(tip)
        } else {
          // Toast(data.msg)
        }
        return data.status
      })
  },

  // 获取用户信息
  getUserInfo ({
    commit,
    state
  }, id) {
    return api.getMeInfo(id)
      .then(data => {
        return {
          res: data.status,
          data: data.data
        }
      })
  },

  // 修改用户信息
  editUserInfo ({
    commit,
    state
  }, data) {
    return api.editUserInfo(data)
      .then(data => {
        console.log('修改用户信息 ==>', data)
        if (data.status) {
          Toast('修改成功')
          return true
        } else {
          Toast(data.msg)
          return false
        }
      })
  },

  // 获取用户账户信息
  getUserAccInfo ({
    commit
  }) {
    api.getAccountInfo()
      .then(data => {
        console.log('获取账户信息 ==>', data)
        if (data.status) {
          commit('changeValue', {
            type: 'account',
            value: data.data
          })
        }
      })
  },

  // 上传图片至七牛
  async upLoadQIniu ({
    commit,
    state
  }, file) {
    Toast.loading({
      mask: true,
      duration: 0,
      message: '上传中...'
    });

    try {
      const {
        data
      } = await api.getQnToken()
      console.log(data, '七牛res')
      const params = new FormData()
      params.append('token', data)
      params.append('file', file)
      const {
        key
      } = await api.uploadQn(params)
      Toast.success('上传成功')
      return key
    } catch (err) {
      Toast.fail('上传失败，请重试')
    }

  },

  // 获取汇率
  getExchangeRate ({
    commit
  }) {
    api.getExchangeRate()
      .then(data => {
        console.log('当前汇率 ==>', data)
        commit('changeValue', {
          type: 'buyExchange',
          value: data.buy_exchange
        })
        commit('changeValue', {
          type: 'sellExchange',
          value: data.sell_exchange
        })
      })
  },

  // 获取消息类别
  getUserMsgList ({
    state,
    commit
  }) {
    api.getUserMsgList()
      .then(data => {
        console.log('获取用户消息 ==>', data)
        if (data.status) {
          commit('changeValue', {
            type: 'unreadMsgList',
            value: data.data
          })
        }
      })
  }
}

export default actions
