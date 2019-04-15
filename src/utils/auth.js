/**
 * *权限控制 - 路由跳转前 设置
 * @Author: Lyle
 * @Date: 2018-01-01 14:53:36
 * @Last Modified by: Lyle
 * @Last Modified time: 2018-05-08 17:02:17
 */

import router from '@/router'
import store from '@/store'
import {
  getStore,
  setStore,
  removeStore,
  setPagesTitle,
} from '@/utils/utils'

import {
  ws,
  connection,
  isConnection
} from '@/utils/msg_ws'


/* 路由跳转之前 */
router.beforeEach(async (to, from, next) => {
  console.log(to, from, 'beforeEachbeforeEach')
  const fromDate = from
  setStore('FromRoute', {
    path: fromDate.name,
    query: fromDate.query
  })
  const auth = to.meta.reqAuth
  const localToken = getStore('token', 'localStorage')
  const userInfo = getStore('userInfo', 'sessionStorage')
  console.log('isConnection  ==>', isConnection)

  console.log(auth)
  // 记住登录前的路由
  const blackList = ['login', 'err_404', 'bind_tel', 'valid_tel', 'reset_pw', null]
  if (!blackList.includes(from.name)) {
    setStore('fromPath', {
      path: from.name,
      query: from.query
    })
  }

  try {
    const trasferList = ['account_withdraw', 'account_recharge']
    if (to.name === 'transfer_page' && trasferList.includes(from.name)) {
      next({
        path: '/me',
        replace: true
      })
    }

    // if (to.name === 'login' && from.name === 'mall_detail') {
    //   next({
    //     path: '/home',
    //     replace: true
    //   })
    // }

    if (localToken && userInfo.includes('id')) {
      store.commit('changeValue', {
        type: 'isLogin',
        value: true
      })
      store.commit('changeValue', {
        type: 'userInfo',
        value: JSON.parse(userInfo)
      })
      if (!isConnection) {
        connection()
      }
      next()
    } else if (localToken) {
      // 验证用户信息
      const {
        res,
        data
      } = await store.dispatch('getUserInfo')
      console.log('验证用户信息结果 ==>', res, data)
      if (res) {
        setStore('token', localToken)
        setStore('userInfo', data)
        store.commit('changeValue', {
          type: 'isLogin',
          value: true
        })
        store.commit('changeValue', {
          type: 'userInfo',
          value: data
        })
        if (!isConnection) {
          connection()
        }
        next()
      } else {
        store.commit('changeValue', {
          type: 'isLogin',
          value: false
        })
        removeStore('token', 'localStorage')
        removeStore('userInfo')
        if (isConnection) {
          ws.close()
        }
        auth ? next('/login') : next()
      }
    } else if (!auth) {
      next()
    } else {
      if (isConnection) {
        ws.close()
      }
      store.commit('changeValue', {
        type: 'isLogin',
        value: false
      })
      next('/login')
    }
  } catch (err) {
    next('/login')
  }

  const isBind = getStore('isBind')
  if (to.name === 'login' && isBind !== '0') {
    setPagesTitle('跳转中')
  } else {
    const title = to.meta.title
    setPagesTitle(title)
  }
})
