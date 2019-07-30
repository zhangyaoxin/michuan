import Vue from 'vue'
import store from '@/store'
const avatar = require('../assets/images/me_head.png')
const cover = require('../assets/images/head_icon.png')

Vue.filter('filterViewsNum', (num) => {
  num = String(num)
  const len = num.length
  if (len === 5) {
    num = (num / 10000).toFixed(1) + '万'
  } else if (len > 5) {
    num = parseInt(num / 10000) + '万'
  }
  return num
})

Vue.filter('filterMsgNum', (num) => {
  num = Number(num)
  num = num > 99 ? '99+' : num
  return num || ''
})

Vue.filter('filterFm', (num) => {
  return Number(num)
})

Vue.filter('filterImg', (url, type) => {
  if (url === '') return type === 'avatar' ? avatar : cover
  if ((url || "").substr(0, 7).toLowerCase() == "http://") return url
  return store.state.qiniuBaseUrl + url
})

Vue.filter('filterTime', (time) => {
  const timers = time.split(':')
  timers.pop()
  return timers.join(':')
})

Vue.filter('filterDate', (date) => {
  return new Date(date * 1000).format('yyyy.MM.dd')
})


Vue.filter('filterBuyExchange', (num, type) => {
  const buy = store.state.buyExchange
  const sell = store.state.sellExchange
  if (type === 'buy') {
    return Number((num / buy).toFixed(2))
  } else if (type === 'sell') {
    return Number((num * sell).toFixed(3))
  } else {
    return num * buy
  }

})

Vue.filter('filterSellExchange', (num, type) => {
  const buy = store.state.buyExchange
  const sell = store.state.sellExchange
  if (type === 'sell') {
    return Number((num / sell).toFixed(2))
  }
})

Vue.filter('filterPay',(num, type) => {
  const pay = store.state.payExchange
  if(type === 'pay') {
    return Number((num * pay).toFixed(2))
  }
})
