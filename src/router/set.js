import {
  getComponent
} from '@/utils/utils'

export default [{
    path: '/set',
    name: 'set',
    component: getComponent('views/set/set'),
    meta: {
      title: '系统设置'
    }
  },
  {
    path: '/about_me',
    name: 'about_me',
    component: getComponent('views/set/about_me'),
    meta: {
      title: '关于蜜传'
    }
  },

  // 账户安全
  {
    path: '/account_security',
    name: 'account_security',
    component: getComponent('views/set/account_security/index'),
    meta: {
      title: '账户安全',
      reqAuth: true,
    }
  },
  {
    path: '/edit_tel',
    name: 'edit_tel',
    component: getComponent('views/set/account_security/edit_tel'),
    meta: {
      title: '更换手机',
      reqAuth: true,
    }
  },
  {
    path: '/set_pw',
    name: 'set_pw',
    component: getComponent('views/set/account_security/set_pw'),
    meta: {
      title: '设置密码',
      reqAuth: true,
    }
  },
  {
    path: '/edit_pw',
    name: 'edit_pw',
    component: getComponent('views/set/account_security/edit_pw'),
    meta: {
      title: '修改密码',
      reqAuth: true,
    }
  },


  // 帮助与反馈 
  {
    path: '/help_feedback',
    name: 'help_feedback',
    component: getComponent('views/set/help_feedback/index'),
    meta: {
      title: '帮助与反馈'
    }
  },
  {
    path: '/mc_raiders',
    name: 'mc_raiders',
    component: getComponent('views/set/help_feedback/mc_raiders'),
    meta: {
      title: '采蜜攻略'
    }
  },
  {
    path: '/put_task',
    name: 'put_task',
    component: getComponent('views/set/help_feedback/put_task'),
    meta: {
      title: '发布任务'
    }
  },
  {
    path: '/hot_issues',
    name: 'hot_issues',
    component: getComponent('views/set/help_feedback/hot_issues'),
    meta: {
      title: '热点问题'
    }
  },
  {
    path: '/feed_back',
    name: 'feed_back',
    component: getComponent('views/set/help_feedback/feed_back'),
    meta: {
      reqAuth: true,
      title: '意见反馈'
    }
  }
]
