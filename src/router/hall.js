import {
  getComponent
} from '@/utils/utils'

export default [
  {
    path: '/hall',
    name: 'hall',
    component: getComponent('views/hall/index'),
    meta: {
      title: '蜜传',
    }
  },
  {
    path: '/hall_money',
    name: 'hall_money',
    component: getComponent('views/hall/money'),
    meta: {
      title: '红包攻略',
    }
  },
  {
    path: '/hall_search',
    name: 'hall_search',
    component: getComponent('views/hall/search'),
    meta: {
      title: '搜索'
    }
  },
  {
    path: '/search_result',
    name: 'search_result',
    component: getComponent('views/hall/search_result'),
    meta: {
      title: '搜索结果'
    }
  },
  {
    path: '/more_search_user',
    name: 'more_search_user',
    component: getComponent('views/hall/more_search_user'),
    meta: {
      title: '相关用户'
    }
  }
]
