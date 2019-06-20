import {
  getComponent
} from '@/utils/utils'

export default [{
    path: '/put_list',
    name: 'put_list',
    component: getComponent('views/ad/put_list'),
    meta: {
      reqAuth: true,
      title: '发布'
    }
  },
  {
    path: '/create_ad',
    name: 'create_ad',
    component: getComponent('views/ad/create/index'),
    meta: {
      reqAuth: true,
      title: '新建发布'
    }
  },
  {
    path: '/ad_details',
    name: 'ad_details',
    component: getComponent('views/ad/detail/index'),
    meta: {
      // title: '蜜传'
    }
  },
  {
    path: '/ad_preview',
    name: 'ad_preview',
    component: getComponent('views/ad/detail/index'),
    meta: {
      title: '广告预览'
    }
  },

  {
    path: '/cover_crop',
    name: 'cover_crop',
    component: getComponent('components/ad_put/cover_com'),
    meta: {
      reqAuth: true,
      title: '图片裁剪'
    }
  },
  // 模板
  // 奖励
  {
    path: '/luck_reward',
    name: 'luck_reward',
    component: getComponent('components/ad_put/rewrad_com'),
    meta: {
      reqAuth: true,
      title: '拼手气红包'
    }
  },
  {
    path: '/reward',
    name: 'reward',
    component: getComponent('components/ad_put/rewrad_com'),
    meta: {
      reqAuth: true,
      title: '普通红包'
    }
  },

  // 优惠券
  {
    path: '/reduce',
    name: 'reduce',
    component: getComponent('components/ad_put/coupon_com'),
    meta: {
      reqAuth: true,
      title: '满减优惠券'
    }
  },
  {
    path: '/discount',
    name: 'discount',
    component: getComponent('components/ad_put/coupon_com'),
    meta: {
      reqAuth: true,
      title: '折扣优惠券'
    }
  },
]
