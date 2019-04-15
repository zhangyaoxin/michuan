import {
  getComponent
} from '@/utils/utils'

export default [{
    path: '/mc_protocol',
    name: 'mc_protocol',
    component: getComponent('views/other/mc_protocol'),
    meta: {
      title: '蜜传协议'
    }
  },
  {
    path: '/task_end',
    name: 'task_end',
    component: getComponent('views/other/task_end'),
    meta: {
      title: '任务已结束'
    }
  },
  {
    path: '/active_page',
    name: 'active_page',
    component: getComponent('views/other/active_page'),
    meta: {
      title: '活动页'
    }
  },
  {
    path: '/download',
    name: 'download',
    component: getComponent('views/other/download'),
    meta: {
      title: '蜜传'
    }
  },
  {
    path: '/test',
    name: 'test',
    component: getComponent('views/other/test'),
    meta: {
      title: '测试页面'
    }
  },
  {
    path: '/transfer_page',
    name: 'transfer_page',
    component: getComponent('views/other/transfer_page'),
    meta: {
      title: '蜜传'
    }
  },
]
