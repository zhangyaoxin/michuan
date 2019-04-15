import {
  getComponent
} from '@/utils/utils'

export default [{
    path: '/mall',
    name: 'mall',
    component: getComponent('views/mall/test'),
    meta: {
      title: '商城测试'
    }
  },
  {
    path: '/mall_search',
    name: 'mall_search',
    component: getComponent('views/mall/search'),
    meta: {
      title: '搜索'
    }
  },
  {
    path: '/search_secondary',
    name: 'search_secondary',
    component: getComponent('views/mall/search_secondary'),
    meta: {
      title: '搜索结果'
    }
  },

  {
    path: '/mall_index',
    name: 'mall_index',
    component: getComponent('views/mall/index'),
    meta: {
      title: '蜜传',
    }
  },
  {
    path: '/tb_list',
    name: 'tb_list',
    component: getComponent('views/mall/components/comm_secondary'),
    meta: {
      title: '淘宝',
    }
  },
  {
    path: '/tm_list',
    name: 'tm_list',
    component: getComponent('views/mall/components/comm_secondary'),
    meta: {
      title: '天猫',
    }
  },
  {
    path: '/pdd_list',
    name: 'pdd_list',
    component: getComponent('views/mall/components/comm_secondary'),
    meta: {
      title: '拼多多',
    }
  },
  {
    path: '/jhs_list',
    name: 'jhs_list',
    component: getComponent('views/mall/components/comm_secondary'),
    meta: {
      title: '聚划算',
    }
  },
  {
    path: '/dpms_list',
    name: 'dpms_list',
    component: getComponent('views/mall/components/comm_secondary'),
    meta: {
      title: '大牌秒杀',
    }
  },
  {
    path: '/9.9_list',
    name: '9.9_list',
    component: getComponent('views/mall/components/comm_secondary'),
    meta: {
      title: '9.9包邮',
    }
  },
  {
    path: '/hot_list',
    name: 'hot_list',
    component: getComponent('views/mall/hot_sell'),
    meta: {
      title: '热销榜',
    }
  },
  {
    path: '/timer_list',
    name: 'timer_list',
    component: getComponent('views/mall/limited_time'),
    meta: {
      title: '限时抢购',
    }
  },
  {
    path: '/mall_detail',
    name: 'mall_detail',
    component: getComponent('views/mall/detail'),
    meta: {
      title: '商品详情',
    }
  },
  {
    path: '/mall_order',
    name: 'mall_order',
    component: getComponent('views/mall/order'),
    meta: {
      title: '商品订单',
      reqAuth: true,
    }
  },
]
