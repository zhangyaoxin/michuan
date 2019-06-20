import Vue from 'vue'
import Router from 'vue-router'
import {
  getComponent
} from '@/utils/utils'

import Login from './login'
import Ad from './ad'
import Me from './me'
import set from './set'
import Other from './Other'
import Mall from './mall'
import Call from './call'
import Hall from './hall'
import NewMap from './newMap'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [{
    path: '/',
    name: 'newMap',
    redirect: '/newMap'
  },
  {
    path: '/home',
    name: 'home',
    component: getComponent('views/mall/index'),
    meta: {
      title: '蜜传'
    }
  },

  ...Login,
  ...Ad,
  ...Me,
  ...set,
  ...Other,
  ...Mall,
  ...Call,
  ...Hall,
  ...NewMap,
  {
    path: 'task_end',
    name: 'task_end',
    component: getComponent('views/other/task_end'),
    meta: {
      title: '内容已结束'
    }
  },
  {
    path: '*',
    name: 'err_404',
    component: getComponent('views/other/err_404'),
    meta: {
      title: '页面丢失'
    }
  },
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})
