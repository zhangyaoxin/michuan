import {
  getComponent
} from '@/utils/utils'

export default [{
    path: '/me',
    name: 'me',
    component: getComponent('views/me/me'),
    meta: {
      title: '蜜传'
    }
  },
  // 我的账户
  {
    path: '/me_account',
    name: 'me_account',
    component: getComponent('views/me/me_account/index'),
    meta: {
      reqAuth: true,
      title: '我的账户'
    }
  },
  {
    path: '/account_recharge',
    name: 'account_recharge',
    component: getComponent('views/me/me_account/account_recharge'),
    meta: {
      reqAuth: true,
      title: '充值'
    }
  },
  {
    path: '/recharge_result',
    name: 'recharge_result',
    component: getComponent('views/me/me_account/recharge_result'),
    meta: {
      reqAuth: true,
      title: '充值结果'
    }
  },
  {
    path: '/account_withdraw',
    name: 'account_withdraw',
    component: getComponent('views/me/me_account/account_withdraw'),
    meta: {
      reqAuth: true,
      title: '提现'
    }
  },
  {
    path: '/withdraw_success',
    name: 'withdraw_success',
    component: getComponent('views/me/me_account/withdraw_success'),
    meta: {
      reqAuth: true,
      title: '提现成功'
    }
  },

  {
    path: '/account_detail',
    name: 'account_detail',
    component: getComponent('views/me/me_account/account_detail'),
    meta: {
      reqAuth: true,
      title: '账户明细'
    }
  },


  {
    path: '/me_browse',
    name: 'me_browse',
    component: getComponent('views/me/me_browse'),
    meta: {
      title: '我的浏览'
    }
  },

  {
    path: '/me_attent',
    name: 'me_attent',
    component: getComponent('views/me/me_attent'),
    meta: {
      title: '我的关注'
    }
  },
  {
    path: '/me_fans',
    name: 'me_fans',
    component: getComponent('views/me/me_fans'),
    meta: {
      title: '我的粉丝'
    }
  },

  {
    path: '/me_public',
    name: 'me_public',
    component: getComponent('views/me/me_public'),
    meta: {
      reqAuth: true,
      title: '我的发布'
    }
  },
  {
    path: '/me_index',
    name: 'me_index',
    component: getComponent('views/me/me_index'),
    meta: {
      title: '我的主页'
    }
  },

  {
    path: '/user_ad_list',
    name: 'user_ad_list',
    component: getComponent('views/me/user_ad_list'),
    meta: {
      title: '我的发布'
    }
  },

  {
    path: '/me_msg',
    name: 'me_msg',
    component: getComponent('views/me/me_msg/index'),
    meta: {
      reqAuth: true,
      title: '我的消息'
    }
  },

  {
    path: '/msg_list',
    name: 'msg_list',
    component: getComponent('views/me/me_msg/msg_detail'),
    meta: {
      reqAuth: true,
      title: '消息列表'
    }
  },


  {
    path: '/me_sign',
    name: 'me_sign',
    component: getComponent('views/me/me_sign'),
    meta: {
      reqAuth: true,
      title: '签到'
    }
  },
  {
    path: '/me_level',
    name: 'me_level',
    component: getComponent('views/me/me_level'),
    meta: {
      reqAuth: true,
      title: '我的等级'
    }
  },
  {
    path: '/me_badge_public',
    name: 'me_badge_public',
    component: getComponent('views/me/me_badge_public'),
    meta: {
      reqAuth: true,
      title: '发布徽章'
    }
  },
  {
    path: '/me_badge_share',
    name: 'me_badge_share',
    component: getComponent('views/me/me_badge_share'),
    meta: {
      reqAuth: true,
      title: '传播徽章'
    }
  },
  {
    path: '/me_edit',
    name: 'me_edit',
    component: getComponent('views/me/me_edit'),
    meta: {
      reqAuth: true,
      title: '个人信息'
    }
  },
  {
    path: '/me_invite',
    name: 'me_invite',
    component: getComponent('views/me/me_invite'),
    meta: {
      reqAuth: true,
      title: '邀请好友'
    }
  },
  {
    path: '/invite_share',
    name: 'invite_share',
    component: getComponent('views/me/invite_share'),
    meta: {
      reqAuth: true,
      title: '好友分享'
    }
  },
  {
    path: '/me_rank',
    name: 'me_rank',
    component: getComponent('views/me/me_rank'),
    meta: {
      reqAuth: true,
      title: '排行榜'
    }
  },

  {
    path: '/me_qrcode',
    name: 'me_qrcode',
    component: getComponent('views/me/me_qrcode'),
    meta: {
      reqAuth: true,
      title: '我的二维码'
    }
  }
]
