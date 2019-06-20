// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BaiduMap from 'vue-baidu-map'
import App from './App'
import store from '@/store'
import router from './router'
import api from '@/api'
import filter from './filters'
import './utils/auth'
import './assets/css/base.scss'
import $ from 'jquery'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'trHdY75cpqkWWaUchb0Uf8ctUdrjh8tz'
})
Vue.config.productionTip = false
Vue.prototype.$api = api
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
