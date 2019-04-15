/**
 * *状态管理 Mutations
 * @Author: Lyle
 * @Date: 2018-10-12 14:13:31
 * @Last Modified by: Lyle
 * @Last Modified time: 2018-10-13 11:25:09
 */

import {
  returnMsgType
} from '@/assets/js/common.js'
import {
  Toast
} from 'vant'
const mutations = {
  /**
   **统一改变值
   * @param {String} data.type state中的类型
   * @param {String} data.stype type类型中的类型
   * @param {any} data.value 修改的值
   */
  changeValue(state, {
    type,
    value,
    stype
  }) {
    // console.log('统一改变值 ==>', type, value)
    if (stype) {
      state[type][stype] = value
    } else {
      state[type] = value
    }
  },

  changeMsgData(state, data) {
    // console.log(data)
    state.msg.push(data)
  },

   // 获取验证码定时器
  setTimer(state) {
    state.showReminderTime = true
    state.timer = setInterval(() => {
      if (state.reminderTime > 0) {
        state.reminderTime--
      } else {
        clearInterval(state.timer)
        state.showReminderTime = false
        state.reminderTime = 60
      }
    }, 1000)
  },
 
  // 消息触发出来函数
  dispatchMsgEve(state, msg) {
    try {
      console.log(msg)
      const type = returnMsgType(msg.msg_type)
      console.log(type, state)
      const val = state.unreadMsgList[type] || 0
      console.log(val)
      state.unreadMsgList[type] = val + 1

      setTimeout(() => {
        const dom = document.querySelector('#msgAudio')
        dom.play()
      }, 0);
    } catch (error) {
      console.log(error)
    }


  }
}

export default mutations
