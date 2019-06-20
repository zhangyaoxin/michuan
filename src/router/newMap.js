import {
    getComponent
} from '@/utils/utils'

export default [{
      path: '/newMap',
      name: 'newMap',
      component: getComponent('views/newMap/index'),
      meta: {
        title: '首页'
    }
},
    {
        path: '/red_package',
        name: 'red_package',
        component: getComponent('views/newMap/red_package'),
        meta: {
            title: '免单攻略'
        }
    },
]
  