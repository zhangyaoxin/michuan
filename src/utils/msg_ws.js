 import store from '@/store'
 import {
   getStore
 } from '@/utils/utils'

 import {} from 'vant'

 let ws = null
 let timer = null
 let limit = 0
 let lockReconnect = false
 let isConnection = false


 // 连接
 const connection = () => {
   const user_id = store.state.userInfo.id || store.state.userInfo.user_id
   const token = getStore('token', 'localStorage')
   if (!user_id || !token) return false
   const wsUrl = 'ws://39.105.212.156/notice?user_id=' + user_id + '&sign=' + token

   if ('WebSocket' in window) {
     ws = new WebSocket(wsUrl)
     initEventHandle()
   } else {}
 }

 // 重新连接
 const reconnect = () => {
   //  console.log('重新连接 ==>', limit)
   if (lockReconnect) return
   lockReconnect = true
   if (limit < 3) {
     timer = setTimeout(() => {
       connection()
       lockReconnect = false
     }, 5000)
     limit++
   }
 }


 // 心跳
 const heartCheck = {
   timeout: 15000,
   timeoutObj: null,
   serverTimeoutObj: null,

   reset() {
     clearTimeout(this.timeoutObj);
     clearTimeout(this.serverTimeoutObj);
     return this;
   },

   start() {
     this.timeoutObj = setTimeout(() => {
       //  console.log('发送ping');
       const token = getStore('token', 'localStorage')
       if (!token) this.reset()
       const str = {
         Type: 'Heartbeat',
         Sign: token
       }
       ws.send(JSON.stringify(str))

       this.serverTimeoutObj = setTimeout(() => {
         //  console.log('服务器超时未响应')
         ws.close();
       }, this.timeout);

     }, this.timeout);
   }
 }


 // 事件
 const initEventHandle = () => {
   ws.onopen = () => {
     //  console.log('ws连接成功')
     isConnection = true
     heartCheck.reset().start()
   }

   ws.onmessage = (evt) => {
     let received_msg = evt.data
     //  console.log('数据已接收...', received_msg)

     if (received_msg === 'pong') {
       heartCheck.reset().start()
     } else {
       // 业务逻辑
       // 1.触发消息提示
       if (received_msg.includes('msg_type')) {
         const msg = JSON.parse(received_msg)
         store.commit('changeMsgData', msg)
         store.commit('dispatchMsgEve', msg)
       }
     }
   }

   ws.onerror = (err) => {
     //  console.log('连接错误', err, err.status)
     isConnection = false
     reconnect()
   }

   ws.onclose = () => {
     //  console.log('连接已关闭...')
     isConnection = false
     reconnect()
   }
 }



 window.addEventListener('offline', function (e) {
   //  console.log('没有网络');
   ws.close()
 })

 window.addEventListener('online', function (e) {
   //  console.log('有网络');
   reconnect()
 })


 export {
   ws,
   isConnection,
   connection
 }
