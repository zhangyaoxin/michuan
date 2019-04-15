import {
  getComponent
} from '@/utils/utils'

export default [
  {
    path: '/login',
    name: 'login',
    component: getComponent('views/login/login'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/invite_code',
    name: 'invite_code',
    component: getComponent('views/login/invite_code'),
    meta: {
      title: '填写邀请码'
    }
  },
  {
    path: '/bind_tel',
    name: 'bind_tel',
    component: getComponent('views/login/bind_tel'),
    meta: {
      title: '绑定手机'
    }
  },
  {
    path: '/valid_tel',
    name: 'valid_tel',
    component: getComponent('views/login/reset_pw'),
    meta: {
      title: '找回密码'
    }
  },
  {
    path: '/reset_pw',
    name: 'reset_pw',
    component: getComponent('views/login/reset_pw'),
    meta: {
      title: '找回密码'
    }
  }
]
